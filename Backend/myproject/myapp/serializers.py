from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, Cart

User = get_user_model()


# ---------------- REGISTER ----------------
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# ---------------- LOGIN ----------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = User.objects.filter(email=data['email']).first()

        if user and user.check_password(data['password']):
            return user

        raise serializers.ValidationError("Invalid email or password")


# ---------------- PRODUCT ----------------
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# ---------------- CART ----------------
class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'