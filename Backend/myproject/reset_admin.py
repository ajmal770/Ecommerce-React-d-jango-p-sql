from myapp.models import User
email = 'admin@example.com'
password = 'admin123'
try:
    u = User.objects.get(email=email)
    u.set_password(password)
    u.role = 'admin'
    u.is_superuser = True
    u.is_staff = True
    u.save()
except User.DoesNotExist:
    User.objects.create_superuser('admin_new', email, password, role='admin')
print('Admin reset successfully!')
