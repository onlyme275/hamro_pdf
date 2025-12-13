from django.contrib import admin
from .models import Ad, AdImpression, AdClick


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ['title', 'placement', 'is_active', 'impressions', 'clicks', 'created_at']
    list_filter = ['placement', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'impressions', 'clicks', 'created_at', 'updated_at']


@admin.register(AdImpression)
class AdImpressionAdmin(admin.ModelAdmin):
    list_display = ['ad', 'user', 'ip_address', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['id', 'created_at']


@admin.register(AdClick)
class AdClickAdmin(admin.ModelAdmin):
    list_display = ['ad', 'user', 'ip_address', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['id', 'created_at']
