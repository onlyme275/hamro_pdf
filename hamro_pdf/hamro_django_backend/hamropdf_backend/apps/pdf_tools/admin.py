from django.contrib import admin
from .models import PDFOperation, TempAnalysis


@admin.register(PDFOperation)
class PDFOperationAdmin(admin.ModelAdmin):
    list_display = ['operation_type', 'user', 'success', 'processing_time', 'created_at']
    list_filter = ['operation_type', 'success', 'created_at']
    search_fields = ['user__email', 'ip_address']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']


@admin.register(TempAnalysis)
class TempAnalysisAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'expires_at']
    readonly_fields = ['id', 'created_at']
