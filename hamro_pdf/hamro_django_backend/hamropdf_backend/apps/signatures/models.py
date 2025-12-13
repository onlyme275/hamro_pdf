"""
Models for Signatures app.
"""

import uuid
from django.db import models
from django.conf import settings


class Signature(models.Model):
    """Digital signature model."""
    
    class SignatureType(models.TextChoices):
        DRAW = 'draw', 'Drawn'
        TEXT = 'text', 'Text'
        IMAGE = 'image', 'Image'

    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='signatures'
    )
    signature_name = models.CharField(max_length=255)
    signature_type = models.CharField(max_length=20, choices=SignatureType.choices)
    signature_data = models.TextField()  # Base64 for drawn/image, text for typed
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'signatures'
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.signature_name} ({self.user.email})"


class UserSignature(models.Model):
    """User signature image file model."""
    
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='signature_files'
    )
    signature_url = models.CharField(max_length=500)
    file_path = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_signatures'
        ordering = ['-created_at']

    def __str__(self):
        return f"Signature by {self.user.email}"