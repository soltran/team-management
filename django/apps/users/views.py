from rest_framework import viewsets, permissions
from .models import CustomUser, Company
from .serializers import CustomUserSerializer, CompanySerializer

class IsSuperuserOrCompanyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.is_company_admin  # Remove the parentheses

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperuserOrCompanyAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return CustomUser.objects.all()
        else:
            return CustomUser.objects.filter(company=user.company)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]