"""
URL patterns for PDF Tools app.
"""

from django.urls import path
from .views import (
    # Core PDF operations
    MergePDFView,
    SplitPDFView,
    CompressPDFView,
    ProtectPDFView,
    UnlockPDFView,
    RotatePDFView,
    OrganizePDFView,
    WatermarkPDFView,
    
    # Conversions
    PDFToImagesView,
    ImagesToPDFView,
    PDFToWordView,
    WordToPDFView,
    PDFToPPTView,
    PPTToPDFView,
    ExcelToPDFView,
    
    # PDF to Excel
    AnalyzePDFView,
    GenerateExcelView,
    
    # Other tools
    AddPageNumbersView,
    SignPDFView,
    RepairPDFView,
    PDFToPDFAView,
    PDFInfoView,
    
    # Test
    PDFToolsTestView,
)

app_name = 'pdf_tools'

urlpatterns = [
    # Test endpoint
    path('test/', PDFToolsTestView.as_view(), name='test'),
    
    # Core PDF operations
    path('merge/', MergePDFView.as_view(), name='merge'),
    path('split/', SplitPDFView.as_view(), name='split'),
    path('compress/', CompressPDFView.as_view(), name='compress'),
    path('protect/', ProtectPDFView.as_view(), name='protect'),
    path('unlock/', UnlockPDFView.as_view(), name='unlock'),
    path('rotate/', RotatePDFView.as_view(), name='rotate'),
    path('organize/', OrganizePDFView.as_view(), name='organize'),
    path('watermark/', WatermarkPDFView.as_view(), name='watermark'),
    
    # Image conversions
    path('pdf-to-jpg/', PDFToImagesView.as_view(), name='pdf_to_jpg'),
    path('pdf-to-images/', PDFToImagesView.as_view(), name='pdf_to_images'),
    path('jpg-to-pdf/', ImagesToPDFView.as_view(), name='jpg_to_pdf'),
    path('images-to-pdf/', ImagesToPDFView.as_view(), name='images_to_pdf'),
    
    # Document conversions
    path('pdf-to-word/', PDFToWordView.as_view(), name='pdf_to_word'),
    path('word-to-pdf/', WordToPDFView.as_view(), name='word_to_pdf'),
    path('pdf-to-ppt/', PDFToPPTView.as_view(), name='pdf_to_ppt'),
    path('pdf-to-powerpoint/', PDFToPPTView.as_view(), name='pdf_to_powerpoint'),
    path('ppt-to-pdf/', PPTToPDFView.as_view(), name='ppt_to_pdf'),
    path('powerpoint-to-pdf/', PPTToPDFView.as_view(), name='powerpoint_to_pdf'),
    path('excel-to-pdf/', ExcelToPDFView.as_view(), name='excel_to_pdf'),
    
    # PDF to Excel (2-step process)
    path('analyze/', AnalyzePDFView.as_view(), name='analyze'),
    path('generate/', GenerateExcelView.as_view(), name='generate'),
    
    # Other tools
    path('page-numbers/', AddPageNumbersView.as_view(), name='page_numbers'),
    path('number-pages/', AddPageNumbersView.as_view(), name='number_pages'),
    path('sign/', SignPDFView.as_view(), name='sign'),
    path('repair/', RepairPDFView.as_view(), name='repair'),
    path('pdf-a/', PDFToPDFAView.as_view(), name='pdf_a'),
    path('pdfa/', PDFToPDFAView.as_view(), name='pdfa'),
    
    # Info
    path('info/', PDFInfoView.as_view(), name='info'),
]
