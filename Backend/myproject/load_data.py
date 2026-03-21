import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myprjoect.settings')
django.setup()

from users.models import User
from store.models import Product, SparePart

def load_data():
    # Create Superuser
    if not User.objects.filter(email='admin@hardware.com').exists():
        User.objects.create_superuser('admin', 'admin@hardware.com', 'admin123', is_admin=True)
        print("Superuser created: admin@hardware.com / admin123")
    
    # Products Data
    products_data = [
        {
            "name": "Bosch Professional Angle Grinder - GWS 600",
            "description": "High quality angle grinder from Bosch.",
            "price": 2500.00,
            "stock": 50,
            "spares": [
                {"name": "Armature (220-240V)", "price": 800.00},
                {"name": "Field Coil (220-240V)", "price": 450.00}
            ]
        },
        {
            "name": "INGCO Rotary Hammer Drill Machine - RGH6528 - 650Watt",
            "description": "Heavy duty rotary hammer drill.",
            "price": 3500.00,
            "stock": 30,
            "spares": [
                {"name": "Carbon Brushes", "price": 150.00},
                {"name": "SDS Plus Chuck", "price": 600.00}
            ]
        },
        {
            "name": "Stanley Hacksaw Frame",
            "description": "Durable hacksaw frame for professional use.",
            "price": 450.00,
            "stock": 100,
            "spares": [
                {"name": "Hacksaw Blade 12-inch (Pack of 10)", "price": 120.00}
            ]
        },
        {
            "name": "Taparia 1004 8-Inch Adjustable Wrench",
            "description": "Standard 8-inch adjustable wrench.",
            "price": 250.00,
            "stock": 80,
            "spares": []
        },
        {
            "name": "DeWalt DWD112 8 Amp 3/8-Inch VSR Drill",
            "description": "Powerful VSR corded drill.",
            "price": 4200.00,
            "stock": 20,
            "spares": [
                {"name": "Trigger Switch", "price": 300.00}
            ]
        }
    ]

    for p_data in products_data:
        product, created = Product.objects.get_or_create(
            name=p_data['name'],
            defaults={
                'description': p_data['description'],
                'price': p_data['price'],
                'stock': p_data['stock']
            }
        )
        if created:
            for s_data in p_data['spares']:
                SparePart.objects.create(
                    product=product,
                    name=s_data['name'],
                    price=s_data['price']
                )
            print(f"Created Product: {product.name} with {len(p_data['spares'])} spare parts")
        else:
            print(f"Product already exists: {product.name}")

if __name__ == '__main__':
    load_data()
    print("Database data loading complete.")
