from django.contrib import admin
from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'user', 'file_size', 'mime_type', 'uploaded_at']
    list_filter = ['mime_type', 'uploaded_at']
    search_fields = ['file_name', 'user__email']
    readonly_fields = ['id', 'uploaded_at']
