from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import razorpay
import uuid

from .models import Product, ProductImage, CartItem, Order, OrderItem, Invoice
from .serializers import (
    RegisterSerializer, ProductSerializer, CartItemSerializer, 
    OrderSerializer, UserSerializer
)
from .tasks import generate_and_send_invoice, async_send_reset_password_email

User = get_user_model()
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class IsRoleAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'admin')

# ---------------- TOKEN ----------------
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# ---------------- AUTHENTICATION ----------------
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"msg": "Registered Successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(f"Login attempt for: {email}, password: {password}")
        user = User.objects.filter(email=email).first()
        
        if user:
            print(f"User found: {user.email}, Role: {user.role}")
            if user.check_password(password):
                print("Password correct")
                tokens = get_tokens(user)
                return Response({
                    "token": tokens,
                    "role": user.role,
                    "username": user.username,
                    "email": user.email
                })
            else:
                print("Password incorrect")
        else:
            print("User not found")
            
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('password')
        user = User.objects.filter(email=email).first()
        if user:
            if new_password:
                # Direct password reset (frontend sends email + new password)
                user.set_password(new_password)
                user.save()
                return Response({"msg": "Password reset successfully!"})
            return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "No account found with this email"}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')
        user = User.objects.filter(forgot_password_token=token).first()
        if user:
            user.set_password(new_password)
            user.forgot_password_token = None
            user.save()
            return Response({"msg": "Password reset successful"})
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

# ---------------- CUSTOMER FLOW ----------------
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'description']
    ordering_fields = ['price', 'created_at']

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        product = get_object_or_404(Product, id=product_id)
        
        if product.stock < quantity:
            return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)
            
        cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        return Response({"msg": "Added to cart"})

    def put(self, request):
        cart_item_id = request.data.get('cart_item_id')
        quantity = int(request.data.get('quantity'))
        cart_item = get_object_or_404(CartItem, id=cart_item_id, user=request.user)
        
        if cart_item.product.stock < quantity:
            return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)
            
        cart_item.quantity = quantity
        cart_item.save()
        return Response({"msg": "Cart updated"})

    def delete(self, request):
        cart_item_id = request.data.get('cart_item_id')
        cart_item = get_object_or_404(CartItem, id=cart_item_id, user=request.user)
        cart_item.delete()
        return Response({"msg": "Removed from cart"})

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
            
        total_amount = sum(item.product.price * item.quantity for item in cart_items)
        
        # Create Razorpay Order
        razor_order = client.order.create({
            "amount": int(total_amount * 100), # amount in paise
            "currency": "INR",
            "payment_capture": "1"
        })
        
        # Create local order
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            status='pending'
        )
        
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            # Update stock
            item.product.stock -= item.quantity
            item.product.save()
            
        return Response({
            "order_id": order.id,
            "razorpay_order_id": razor_order['id'],
            "amount": total_amount
        })

class PaymentSuccessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')
        
        # Verify signature
        params_dict = {
            'razorpay_order_id': request.data.get('razorpay_order_id'),
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        
        try:
            client.utility.verify_payment_signature(params_dict)
            order = Order.objects.get(id=order_id, user=request.user)
            order.status = 'paid'
            order.save()
            
            # Clear cart
            CartItem.objects.filter(user=request.user).delete()
            
            generate_and_send_invoice.delay(order.id)
            
            return Response({"msg": "Payment Successful"})
        except Exception:
            return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

# ---------------- ADMIN FLOW ----------------
class AdminProductView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            img_url = request.data.get('img')
            if img_url:
                ProductImage.objects.create(product=product, image_url=img_url)
                
            images = request.FILES.getlist('images')
            for img in images:
                pass
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminOrderListView(generics.ListAPIView):
    permission_classes = [IsRoleAdmin]
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

class AdminOrderStatusView(APIView):
    permission_classes = [IsRoleAdmin]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        status_val = request.data.get('status')
        if status_val in dict(Order.STATUS_CHOICES):
            order.status = status_val
            order.save()
            return Response({"msg": f"Order status updated to {status_val}"})
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

# ---------------- USER PROFILE & ORDERS ----------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data
        
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        if 'email' in data: user.email = data['email']
        
        if 'password' in data and data['password']:
            user.set_password(data['password'])
            
        user.save()
        return Response({"msg": "Profile updated successfully"})

class UserOrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')