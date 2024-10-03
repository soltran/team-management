import logging
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CustomUser, Company
from .serializers import CustomUserSerializer, CompanySerializer

logger = logging.getLogger(__name__)

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

    def perform_create(self, serializer):
        # Assign the new user to the same company as the requesting user
        company = self.request.user.company
        serializer.save(company=company)

    @action(detail=True, methods=['patch'])
    def update_own_profile(self, request, pk=None):
        user = self.get_object()
        if request.user != user:
            return Response({"detail": "You can only update your own profile."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        if not request.user.is_superuser and not request.user.is_company_admin:
            return Response({"detail": "You don't have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_superuser and not request.user.is_company_admin:
            return Response({"detail": "You don't have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        logger.info(f"Performing update for user {serializer.instance.username}")
        serializer.save()

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]