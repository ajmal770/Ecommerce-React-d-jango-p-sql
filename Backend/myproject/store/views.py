from rest_framework import viewsets, permissions
from .models import Product, SparePart
from .serializers import ProductSerializer, SparePartSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_admin

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return Product.objects.all().order_by('-created_at')

class SparePartViewSet(viewsets.ModelViewSet):
    queryset = SparePart.objects.all()
    serializer_class = SparePartSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = SparePart.objects.all()
        product_id = self.request.query_params.get('product', None)
        if product_id is not None:
            queryset = queryset.filter(product_id=product_id)
        return queryset
