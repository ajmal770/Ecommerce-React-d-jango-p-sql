from celery import shared_task
from .models import Order, Invoice
from .utils import generate_invoice_pdf, send_invoice_email, send_reset_password_email
from django.contrib.auth import get_user_model

User = get_user_model()

@shared_task
def generate_and_send_invoice(order_id):
    try:
        order = Order.objects.get(id=order_id)
        if order.status == 'paid':
            file_path, pdf_url = generate_invoice_pdf(order)
            Invoice.objects.create(
                order=order,
                invoice_number=f"INV-{order.id}-{order.created_at.strftime('%Y%m%d')}",
                pdf_url=pdf_url,
                file_path=file_path
            )
            send_invoice_email(order, file_path)
    except Order.DoesNotExist:
        pass

@shared_task
def async_send_reset_password_email(user_id, token):
    try:
        user = User.objects.get(id=user_id)
        send_reset_password_email(user, token)
    except User.DoesNotExist:
        pass
