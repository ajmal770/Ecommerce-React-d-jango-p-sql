from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, ProductImage, CartItem, Order, OrderItem, Invoice

User = get_user_model()


# ---------------- USER ----------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# ---------------- PRODUCT ----------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'old_price', 'stock', 'category', 'images', 'created_at', 'updated_at']


# ---------------- CART ----------------
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'created_at']

    def create(self, validated_data):
        return CartItem.objects.create(**validated_data)


# ---------------- ORDER ----------------
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'pdf_url', 'file_path', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    invoice = InvoiceSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'items', 'total_amount', 'status', 'invoice', 'created_at', 'updated_at']