from rest_framework import permissions

class IsPublicOrOwner(permissions.BasePermission):
    """
    Custom permission to allow owners of an object to edit it,
    but allow public read access if is_public is True.
    """
    def has_object_permission(self, request, view, obj):
        if obj.is_public and request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
