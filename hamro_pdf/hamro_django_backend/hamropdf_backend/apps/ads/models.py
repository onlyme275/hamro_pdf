"""
Models for Ads app.
"""

import uuid
from django.db import models
from django.conf import settings


class Ad(models.Model):
    """Advertisement model."""
    
    class Placement(models.TextChoices):
        HOME = 'home', 'Home Page'
        DASHBOARD = 'dashboard', 'Dashboard'
        TOOLS = 'tools', 'Tools Page'
        SIDEBAR = 'sidebar', 'Sidebar'
        HEADER = 'header', 'Header'
        FOOTER = 'footer', 'Footer'

    class Position(models.TextChoices):
        TOP = 'top', 'Top'
        CENTER = 'center', 'Center'
        BOTTOM = 'bottom', 'Bottom'
        LEFT = 'left', 'Left'
        RIGHT = 'right', 'Right'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    image_url = models.CharField(max_length=500, null=True, blank=True)
    link_url = models.CharField(max_length=500, null=True, blank=True)
    placement = models.CharField(max_length=50, choices=Placement.choices)
    position = models.CharField(max_length=20, choices=Position.choices, default=Position.CENTER)
    width = models.IntegerField(default=300)
    height = models.IntegerField(default=250)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_ads'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ads'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def ctr(self):
        """Click-through rate."""
        if self.impressions > 0:
            return round((self.clicks / self.impressions) * 100, 2)
        return 0


class AdImpression(models.Model):
    """Track ad impressions."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='impression_logs')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ad_impressions'


class AdClick(models.Model):
    """Track ad clicks."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='click_logs')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ad_clicks'
