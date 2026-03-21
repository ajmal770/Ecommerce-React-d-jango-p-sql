import razorpay
from django.conf import settings
from rest_framework import views, viewsets, status, permissions
from rest_framework.response import Response
from .models import Cart, CartItem, Order, OrderItem, Invoice
from store.models import Product
from .serializers import CartSerializer, OrderSerializer, InvoiceSerializer

# Initialize razorpay client
razorpay_client = razorpay.Client(auth=(getattr(settings, 'RAZORPAY_KEY_ID', 'test_key'), getattr(settings, 'RAZORPAY_KEY_SECRET', 'test_secret')))

class CartView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        if cart_item.quantity <= 0:
            cart_item.delete()
        else:
            cart_item.save()
            
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
        total_amount = sum(item.product.price * item.quantity for item in cart.items.all())
        
        # Create Order
        order = Order.objects.create(user=request.user, total_amount=total_amount)
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price
            )
            
        # Create Razorpay Order
        razorpay_order = razorpay_client.order.create({
            "amount": int(total_amount * 100), # Amount in paise
            "currency": "INR",
            "receipt": f"order_rcptid_{order.id}"
        })
        
        # Create Invoice
        Invoice.objects.create(
            order=order,
            razorpay_order_id=razorpay_order['id']
        )
        
        # Clear Cart
        cart.items.all().delete()
        
        return Response({
            'order_id': order.id,
            'razorpay_order_id': razorpay_order['id'],
            'amount': total_amount,
            'currency': 'INR'
        })

class VerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
            # Payment Successful
            invoice = Invoice.objects.get(razorpay_order_id=razorpay_order_id)
            invoice.razorpay_payment_id = razorpay_payment_id
            invoice.payment_status = 'Paid'
            invoice.save()
            
            invoice.order.status = 'Completed'
            invoice.order.save()
            
            # Send Email implementation goes here later if needed
            
            return Response({'status': 'Payment verified successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
