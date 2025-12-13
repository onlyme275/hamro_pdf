"""
Models for PDF Tools app.
"""

import uuid
from django.db import models
from django.conf import settings


class PDFOperation(models.Model):
    """Track PDF operations for analytics."""

    class OperationType(models.TextChoices):
        MERGE = 'merge', 'Merge PDF'
        SPLIT = 'split', 'Split PDF'
        COMPRESS = 'compress', 'Compress PDF'
        PROTECT = 'protect', 'Protect PDF'
        UNLOCK = 'unlock', 'Unlock PDF'
        ROTATE = 'rotate', 'Rotate PDF'
        WATERMARK = 'watermark', 'Watermark PDF'
        ORGANIZE = 'organize', 'Organize PDF'
        PDF_TO_WORD = 'pdf_to_word', 'PDF to Word'
        PDF_TO_EXCEL = 'pdf_to_excel', 'PDF to Excel'
        PDF_TO_PPT = 'pdf_to_ppt', 'PDF to PowerPoint'
        PDF_TO_JPG = 'pdf_to_jpg', 'PDF to JPG'
        JPG_TO_PDF = 'jpg_to_pdf', 'JPG to PDF'
        WORD_TO_PDF = 'word_to_pdf', 'Word to PDF'
        EXCEL_TO_PDF = 'excel_to_pdf', 'Excel to PDF'
        PPT_TO_PDF = 'ppt_to_pdf', 'PowerPoint to PDF'
        SIGN = 'sign', 'Sign PDF'
        EDIT = 'edit', 'Edit PDF'
        OCR = 'ocr', 'OCR PDF'
        REPAIR = 'repair', 'Repair PDF'
        PAGE_NUMBERS = 'page_numbers', 'Add Page Numbers'
        COMPARE = 'compare', 'Compare PDF'
        PDF_A = 'pdf_a', 'Convert to PDF/A'

    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pdf_operations'
    )
    operation_type = models.CharField(max_length=50, choices=OperationType.choices)
    input_file_count = models.IntegerField(default=1)
    input_file_size = models.BigIntegerField(default=0)  # in bytes
    output_file_size = models.BigIntegerField(default=0)  # in bytes
    processing_time = models.FloatField(default=0)  # in seconds
    success = models.BooleanField(default=True)
    error_message = models.TextField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pdf_operations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.operation_type} - {self.created_at}"


class TempAnalysis(models.Model):
    """Temporary storage for PDF analysis sessions (PDF to Excel)."""
    
    id = models.CharField(max_length=100, primary_key=True)
    columns = models.JSONField(default=list)
    rows = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'temp_analysis'

    def __str__(self):
        return f"Analysis {self.id}"