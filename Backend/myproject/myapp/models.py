from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


# ---------------- USER ----------------
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return self.username


# ---------------- PRODUCT ----------------
class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField(null=True, blank=True)
    discount = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=0)
    reviews = models.PositiveIntegerField(default=0)
    img = models.URLField()

    def __str__(self):
        return self.name


# ---------------- CART ----------------
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)
    address = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
  

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


# ---------------- ORDER ----------------
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.FloatField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Order {self.id}"