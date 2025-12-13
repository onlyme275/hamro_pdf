"""
Serializers for Ads app.
"""

from rest_framework import serializers
from .models import Ad


class AdSerializer(serializers.ModelSerializer):
    """Serializer for Ad model."""
    
    ctr = serializers.ReadOnlyField()
    
    class Meta:
        model = Ad
        fields = [
            'id', 'title', 'description', 'image_url', 'link_url',
            'placement', 'position', 'width', 'height', 'is_active',
            'start_date', 'end_date', 'impressions', 'clicks', 'ctr',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'impressions', 'clicks', 'created_at', 'updated_at']


class AdPublicSerializer(serializers.ModelSerializer):
    """Public serializer for Ad (limited fields)."""
    
    class Meta:
        model = Ad
        fields = ['id', 'title', 'description', 'image_url', 'link_url', 
                  'placement', 'position', 'width', 'height']


class AdCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating ads."""
    
    class Meta:
        model = Ad
        fields = [
            'title', 'description', 'image_url', 'link_url',
            'placement', 'position', 'width', 'height', 'is_active',
            'start_date', 'end_date'
        ]
