from django.urls import path
from .views import CartView, CheckoutView, VerifyPaymentView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
]
