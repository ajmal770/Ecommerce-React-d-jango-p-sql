from django.urls import path
from .views import (
    RegisterView, LoginView, ForgotPasswordView, ResetPasswordView,
    ProductListView, CartView, CheckoutView, PaymentSuccessView,
    AdminProductView, AdminOrderListView, AdminOrderStatusView,
    ProfileView, UpdateProfileView, UserOrderListView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    # Products
    path('products/', ProductListView.as_view(), name='product-list'),

    # Cart
    path('cart/', CartView.as_view(), name='cart'),

    # Checkout & Payment
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('payment-success/', PaymentSuccessView.as_view(), name='payment-success'),

    # Admin
    path('admin/products/', AdminProductView.as_view(), name='admin-products'),
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/orders/<int:pk>/status/', AdminOrderStatusView.as_view(), name='admin-order-status'),

    # Profile & User Orders
    path('profile/', ProfileView.as_view(), name='profile'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('my-orders/', UserOrderListView.as_view(), name='my-orders'),
]