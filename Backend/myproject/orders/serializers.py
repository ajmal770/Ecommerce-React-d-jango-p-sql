from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Invoice
from store.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_details', 'quantity')

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'user', 'created_at', 'items')

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_details', 'quantity', 'price_at_purchase')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'user', 'total_amount', 'status', 'created_at', 'items')

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ('id', 'order', 'razorpay_payment_id', 'razorpay_order_id', 'payment_status', 'invoice_date')
