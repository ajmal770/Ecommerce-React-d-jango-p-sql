from django.contrib.auth import get_user_model

User = get_user_model()
email = 'admin@example.com'
password = 'admin123'

u = User.objects.filter(email=email).first()
if not u:
    u = User.objects.create_superuser('admin', email, password)
    u.role = 'admin'
    u.save()
    print(f'Created new admin: {email}')
else:
    u.set_password(password)
    u.username = 'admin' # Ensure username is admin
    u.role = 'admin'
    u.is_superuser = True
    u.is_staff = True
    u.save()
    print(f'Updated admin: {email}')
