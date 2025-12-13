"""
URL patterns for User app.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    GoogleLoginView,
    GoogleCallbackView,
    MeView,
    UserListView,
    UserDetailView,
    AddUserView,
    DeactivateUserView,
    ChangePasswordView,
    ResetPasswordView,
)

app_name = 'users'

urlpatterns = [
    # Public auth routes
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Google OAuth
    path('google', GoogleLoginView.as_view(), name='google_login'),
    path('google/callback', GoogleCallbackView.as_view(), name='google_callback'),
    
    # Protected routes
    path('me', MeView.as_view(), name='me'),
    path('change-password', ChangePasswordView.as_view(), name='change_password'),
    
    # User management
    path('', UserListView.as_view(), name='user_list'),
    path('<int:pk>', UserDetailView.as_view(), name='user_detail'),
    
    # Admin routes
    path('add', AddUserView.as_view(), name='add_user'),
    path('deactivate/<int:pk>', DeactivateUserView.as_view(), name='deactivate_user'),
    path('reset-password', ResetPasswordView.as_view(), name='reset_password'),
]
