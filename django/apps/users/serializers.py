import uuid
from rest_framework import serializers
from .models import CustomUser, Company
from rest_framework.exceptions import PermissionDenied

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']

class CustomUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'company']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is write-only
            'company': {'read_only': True}  # Make company read-only
        }

    def create(self, validated_data):
        if 'username' not in validated_data or not validated_data['username']:
            # Generate a random username if not provided
            validated_data['username'] = self.generate_unique_username()
        
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        # Check if role is being updated
        if 'role' in validated_data:
            # Assuming you have access to the request user
            request_user = self.context['request'].user
            if request_user.is_superuser or request_user.role == 'admin':
                instance.role = validated_data.pop('role')
            else:
                raise PermissionDenied("Only admins can change user roles.")
        
        return super().update(instance, validated_data)

    def generate_unique_username(self):
        # Generate a unique username based on UUID
        while True:
            username = f"user_{uuid.uuid4().hex[:8]}"
            if not CustomUser.objects.filter(username=username).exists():
                return username
