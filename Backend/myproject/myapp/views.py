from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer, CartSerializer
from .models import Product, Cart

User = get_user_model()


# ---------------- TOKEN ----------------
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# ---------------- REGISTER ----------------
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Registered Successfully"})

        return Response(serializer.errors, status=400)


# ---------------- LOGIN ----------------
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            tokens = get_tokens(user)

            return Response({
                "token": tokens,
                "role": user.role,
                "username": user.username
            })

        return Response(serializer.errors, status=400)


# ---------------- FORGOT PASSWORD ----------------
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()

            return Response({"msg": "Password reset successful"})

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# ---------------- ADD TO CART ----------------
class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")

        product = Product.objects.get(id=product_id)

        cart_item, created = Cart.objects.get_or_create(
            user=user,
            product=product
        )

        if not created:
            cart_item.quantity += 1
            cart_item.save()

        return Response({"message": "Added to cart"})


# ---------------- GET CART ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetCart(request):
    cart_items = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(cart_items, many=True)
    return Response(serializer.data)


# ---------------- UPDATE CART ----------------
class UpdateCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_id = request.data.get("cart_id")
        quantity = request.data.get("quantity")

        item = Cart.objects.get(id=cart_id, user=request.user)
        item.quantity = quantity
        item.save()

        return Response({"message": "Updated"})


# ---------------- REMOVE CART ----------------
class RemoveCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_id = request.data.get("cart_id")

        Cart.objects.get(id=cart_id, user=request.user).delete()

        return Response({"message": "Removed"})