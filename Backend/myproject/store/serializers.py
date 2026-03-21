from rest_framework import serializers
from .models import Product, ProductImage, SparePart

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'image')

class SparePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = SparePart
        fields = ('id', 'name', 'description', 'price')

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    spare_parts = SparePartSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'stock', 'created_at', 'images', 'spare_parts')
