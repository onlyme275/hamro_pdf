"""
Serializers for Signatures app.
"""

from rest_framework import serializers
from .models import Signature, UserSignature


class SignatureSerializer(serializers.ModelSerializer):
    """Serializer for Signature model."""
    
    class Meta:
        model = Signature
        fields = [
            'id', 'user', 'signature_name', 'signature_type', 
            'signature_data', 'width', 'height', 'is_default',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class SignatureCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating signatures."""
    
    class Meta:
        model = Signature
        fields = [
            'signature_name', 'signature_type', 'signature_data',
            'width', 'height', 'is_default'
        ]


class UserSignatureSerializer(serializers.ModelSerializer):
    """Serializer for UserSignature model."""
    
    class Meta:
        model = UserSignature
        fields = ['id', 'user', 'signature_url', 'file_path', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
