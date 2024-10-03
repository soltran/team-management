from rest_framework import viewsets, permissions
from .models import CustomUser, Company
from .serializers import CustomUserSerializer, CompanySerializer

class IsSuperuserOrCompanyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.is_company_admin

class CanManageCompanyUsers(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow superusers full access
        if request.user.is_superuser:
            return True
        
        # Company admins can create new users
        if request.user.is_company_admin and request.method == 'POST':
            return True
        
        # For other methods, defer to has_object_permission
        return True

    def has_object_permission(self, request, view, obj):
        # Allow superusers full access
        if request.user.is_superuser:
            return True
        
        # Company admins can manage users within their company
        if request.user.is_company_admin and obj.company == request.user.company:
            # For DELETE and PATCH methods (delete user or change role)
            if request.method in ['DELETE', 'PATCH']:
                return True
            # For other methods, allow read access
            return request.method in permissions.SAFE_METHODS
        
        # Regular users can only read their own data
        return request.method in permissions.SAFE_METHODS

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated, CanManageCompanyUsers]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return CustomUser.objects.all()
        else:
            return CustomUser.objects.filter(company=user.company)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]