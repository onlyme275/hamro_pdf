"""
Views for User app.
"""

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from django.conf import settings
from social_django.utils import psa
import json
import urllib.parse

from .models import User
from .serializers import (
    UserSerializer, 
    UserCreateSerializer,
    UserUpdateSerializer,
    AdminUserUpdateSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    ResetPasswordSerializer
)
from .permissions import IsAdmin, IsAdminOrSelf


def get_tokens_for_user(user):
    """Generate JWT tokens for user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    """User registration endpoint."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'data': {
                    'user': UserSerializer(user).data,
                    'token': tokens['access'],
                    'refresh': tokens['refresh'],
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login endpoint."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'user': UserSerializer(user).data,
                    'token': tokens['access'],
                    'refresh': tokens['refresh'],
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Login failed',
            'errors': serializer.errors
        }, status=status.HTTP_401_UNAUTHORIZED)


class GoogleLoginView(APIView):
    """Initiate Google OAuth login."""
    permission_classes = [AllowAny]

    def get(self, request):
        # Redirect to social-auth Google endpoint
        return redirect('social:begin', 'google-oauth2')


@psa('social:complete')
def google_callback(request, backend):
    """Handle Google OAuth callback."""
    user = request.backend.do_auth(request.GET.get('access_token'))
    
    if user and user.is_active:
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data
        
        # Redirect to frontend with token
        encoded_user = urllib.parse.quote(json.dumps(user_data))
        redirect_url = f"{settings.FRONTEND_URL}/oauth/callback?token={tokens['access']}&user={encoded_user}"
        return redirect(redirect_url)
    
    return redirect(f"{settings.FRONTEND_URL}/login?error=auth_failed")


class GoogleCallbackView(APIView):
    """Handle Google OAuth callback (alternative approach)."""
    permission_classes = [AllowAny]

    def get(self, request):
        # This is handled by social-auth pipeline
        # The actual callback redirects to frontend
        return Response({
            'success': False,
            'message': 'Use /auth/google/ to initiate OAuth'
        }, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """Get current authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'success': True,
            'user': UserSerializer(request.user).data
        })


class UserListView(generics.ListAPIView):
    """List all users (admin only)."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ['role', 'is_active', 'auth_provider']
    search_fields = ['name', 'email']
    ordering_fields = ['created_at', 'name', 'email']

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            'success': True,
            'users': response.data,
            'message': 'Users retrieved successfully'
        })


class UserDetailView(APIView):
    """Get, update, or delete a specific user."""
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, user)
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'message': 'User retrieved successfully'
        })

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        self.check_object_permissions(request, user)
        
        # Use admin serializer if admin, otherwise regular update serializer
        if request.user.is_admin:
            serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
        else:
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'User updated successfully',
                'user': UserSerializer(user).data
            })
        
        return Response({
            'success': False,
            'message': 'Update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Only admins can delete users
        if not request.user.is_admin:
            return Response({
                'success': False,
                'message': 'Admin privileges required'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Prevent self-deletion
        if request.user.id == user.id:
            return Response({
                'success': False,
                'message': 'You cannot delete your own account'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        })


class AddUserView(APIView):
    """Add new user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'User added successfully',
                'data': {
                    'user': UserSerializer(user).data
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Failed to add user',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class DeactivateUserView(APIView):
    """Deactivate user (admin only)."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Prevent self-deactivation
        if request.user.id == user.id:
            return Response({
                'success': False,
                'message': 'You cannot deactivate your own account'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_active = False
        user.save()
        
        return Response({
            'success': True,
            'message': 'User deactivated successfully'
        })


class ChangePasswordView(APIView):
    """Change password for authenticated user."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            
            return Response({
                'success': True,
                'message': 'Password changed successfully'
            })
        
        return Response({
            'success': False,
            'message': 'Password change failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """Reset user password (admin only)."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = User.objects.get(pk=serializer.validated_data['user_id'])
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'success': True,
                'message': 'Password reset successfully'
            })
        
        return Response({
            'success': False,
            'message': 'Password reset failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
