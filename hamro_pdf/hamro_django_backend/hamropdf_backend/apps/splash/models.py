"""
Models for Splash app.
"""

import uuid
from django.db import models


class Splash(models.Model):
    """Splash screen model."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    image_url = models.CharField(max_length=500, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    button_text = models.CharField(max_length=100, null=True, blank=True)
    button_link = models.CharField(max_length=500, null=True, blank=True)
    background_color = models.CharField(max_length=20, null=True, blank=True)
    text_color = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'splash_screens'
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title
