import os
from django.conf import settings
from django.core.mail import EmailMessage
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_invoice_pdf(order):
    """Generates a PDF invoice for the given order and returns the file path."""
    invoice_dir = os.path.join(settings.MEDIA_ROOT, 'invoices')
    if not os.path.exists(invoice_dir):
        os.makedirs(invoice_dir)

    file_name = f"invoice_{order.id}_{order.created_at.strftime('%Y%m%d%H%M%S')}.pdf"
    file_path = os.path.join(invoice_dir, file_name)

    c = canvas.Canvas(file_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, f"Invoice for Order #{order.id}")
    
    c.setFont("Helvetica", 12)
    c.drawString(100, 730, f"Customer: {order.user.username}")
    c.drawString(100, 715, f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    c.drawString(100, 700, f"Status: {order.status}")
    
    c.line(100, 690, 500, 690)
    
    y = 670
    c.drawString(100, y, "Product")
    c.drawString(300, y, "Quantity")
    c.drawString(400, y, "Price")
    
    y -= 20
    for item in order.items.all():
        c.drawString(100, y, f"{item.product.name if item.product else 'Unknown'}")
        c.drawString(300, y, f"{item.quantity}")
        c.drawString(400, y, f"INR {item.price}")
        y -= 20
        if y < 100:
            c.showPage()
            y = 750

    c.line(100, y, 500, y)
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(300, y, "Total Amount:")
    c.drawString(400, y, f"INR {order.total_amount}")
    
    c.save()
    return file_path, f"{settings.MEDIA_URL}invoices/{file_name}"

def send_invoice_email(order, pdf_path):
    """Sends the invoice PDF to the user's email."""
    subject = f"Your Invoice for Order #{order.id}"
    body = f"Hi {order.user.username},\n\nPlease find your invoice for your recent order attached.\n\nThank you for shopping with us!"
    email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [order.user.email])
    email.attach_file(pdf_path)
    email.send()

def send_reset_password_email(user, token):
    """Sends a password reset link to the user (mocked)."""
    subject = "Password Reset Request"
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    body = f"Hi {user.username},\n\nYou requested a password reset. Click the link below to reset your password:\n\n{reset_link}\n\nIf you didn't request this, please ignore this email."
    email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [user.email])
    email.send()
