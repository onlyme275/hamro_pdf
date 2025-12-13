"""
Models for Files app.
"""

import uuid
from django.db import models
from django.conf import settings


class File(models.Model):
    """User uploaded files model."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    file_path = models.CharField(max_length=500)
    mime_type = models.CharField(max_length=100, default='application/pdf')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'files'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.file_name
