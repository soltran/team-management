from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('regular', 'Regular'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='regular')
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)

    # Override is_superuser field
    is_superuser = models.BooleanField(
        'superuser status',
        default=False,
        help_text='Designates that this user has all permissions without explicitly assigning them.',
    )

    def __str__(self):
        return f"{self.get_full_name()} ({self.company})"

    @property
    def is_company_admin(self):
        return self.role == 'admin'
