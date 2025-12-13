"""
Custom permissions for User app.
"""

from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission check for admin users."""

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsPremiumOrAdmin(permissions.BasePermission):
    """Permission check for premium or admin users."""

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['premium', 'admin']
        )


class IsAdminOrSelf(permissions.BasePermission):
    """
    Permission to only allow admins or the user themselves.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Admin can access any user
        if request.user.role == 'admin':
            return True
        # Users can only access themselves
        return obj.id == request.user.id


class IsOwner(permissions.BasePermission):
    """
    Permission to only allow owners of an object.
    """

    def has_object_permission(self, request, view, obj):
        # Check if object has user_id or user attribute
        if hasattr(obj, 'user_id'):
            return obj.user_id == request.user.id
        if hasattr(obj, 'user'):
            return obj.user.id == request.user.id
        return False


class IsAdminOrOwner(permissions.BasePermission):
    """
    Permission to only allow admins or owners of an object.
    """

    def has_object_permission(self, request, view, obj):
        # Admin can access any object
        if request.user.role == 'admin':
            return True
        
        # Check ownership
        if hasattr(obj, 'user_id'):
            return obj.user_id == request.user.id
        if hasattr(obj, 'user'):
            return obj.user.id == request.user.id
        if hasattr(obj, 'created_by_id'):
            return obj.created_by_id == request.user.id
        if hasattr(obj, 'created_by'):
            return obj.created_by.id == request.user.id
        
        return False
