from django.urls import path
from .views import (
    RegisterView, LoginView, ForgotPasswordView,
    AddToCart, GetCart, UpdateCart, RemoveCart
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('forgot-password/', ForgotPasswordView.as_view()),

    path('add-cart/', AddToCart.as_view()),
    path('get-cart/', GetCart),
    path('update-cart/', UpdateCart.as_view()),
    path('remove-cart/', RemoveCart.as_view()),
]