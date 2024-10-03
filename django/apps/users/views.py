import logging
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
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

    def update(self, request, *args, **kwargs):
        logger.info(f"Update request received for user {kwargs.get('pk')} by {request.user.username}")
        logger.debug(f"Request data: {request.data}")
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # For PATCH requests, always treat as partial updates
        if request.method == 'PATCH':
            partial = True
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_update(serializer)
            logger.info(f"User {instance.username} updated successfully")
            return Response(serializer.data)
        except Exception as e:
            logger.exception(f"Error updating user: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        logger.info(f"Performing update for user {serializer.instance.username}")
        serializer.save()

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]