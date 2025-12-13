"""
Serializers for Splash app.
"""

from rest_framework import serializers
from .models import Splash


class SplashSerializer(serializers.ModelSerializer):
    """Serializer for Splash model."""
    
    class Meta:
        model = Splash
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SplashCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating splash screens."""
    
    class Meta:
        model = Splash
        fields = [
            'title', 'description', 'image_url', 'is_active', 'display_order',
            'start_date', 'end_date', 'button_text', 'button_link',
            'background_color', 'text_color'
        ]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required")
        return value.strip()
