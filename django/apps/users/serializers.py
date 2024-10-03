from rest_framework import serializers
from .models import CustomUser, Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']

class CustomUserSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'company']
        read_only_fields = ['role']  # Role should only be changeable by admins
        extra_kwargs = {
            'username': {'read_only': True},  # Make username read-only for updates
            'password': {'write_only': True}  # Ensure password is write-only
        }
