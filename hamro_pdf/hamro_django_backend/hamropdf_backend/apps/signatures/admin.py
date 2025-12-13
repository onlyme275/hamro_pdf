from django.contrib import admin
from .models import Signature, UserSignature


@admin.register(Signature)
class SignatureAdmin(admin.ModelAdmin):
    list_display = ['signature_name', 'user', 'signature_type', 'is_default', 'created_at']
    list_filter = ['signature_type', 'is_default', 'created_at']
    search_fields = ['signature_name', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(UserSignature)
class UserSignatureAdmin(admin.ModelAdmin):
    list_display = ['user', 'signature_url', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email']
    readonly_fields = ['id', 'created_at']
