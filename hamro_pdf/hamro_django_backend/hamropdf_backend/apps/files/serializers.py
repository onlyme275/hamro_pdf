"""
Serializers for Files app.
"""

from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    """Serializer for File model."""
    
    class Meta:
        model = File
        fields = ['id', 'user', 'file_name', 'file_size', 'file_path', 'mime_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class FileUploadSerializer(serializers.Serializer):
    """Serializer for file upload."""
    
    file = serializers.FileField()
    user_id = serializers.UUIDField()
