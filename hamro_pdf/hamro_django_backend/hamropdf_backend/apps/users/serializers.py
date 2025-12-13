"""
Serializers for User app.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'role', 'image', 'phone', 
            'address', 'auth_provider', 'email_verified', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'auth_provider']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating users."""
    
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'phone', 'address']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating users."""

    class Meta:
        model = User
        fields = ['name', 'phone', 'address', 'image']


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin updating users."""

    class Meta:
        model = User
        fields = ['name', 'email', 'role', 'phone', 'address', 'image', 'is_active']


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid email or password')

            # Check if OAuth user
            if user.auth_provider != 'local' and not user.has_usable_password():
                raise serializers.ValidationError(
                    f'This account uses {user.auth_provider} authentication. '
                    f'Please use {user.auth_provider} to login.'
                )

            # Check if active
            if not user.is_active:
                raise serializers.ValidationError(
                    'Your account has been deactivated. Please contact support.'
                )

            # Authenticate
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')

            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email and password are required')

        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""
    
    old_password = serializers.CharField(required=True, style={'input_type': 'password'})
    new_password = serializers.CharField(
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for admin password reset."""
    
    user_id = serializers.UUIDField(required=True)
    new_password = serializers.CharField(
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
