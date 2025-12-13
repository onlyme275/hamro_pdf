"""
Views for PDF Tools app.
"""

import io
import time
import zipfile
from datetime import datetime

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, FileResponse

from .services import pdf_service
from .excel_service import pdf_to_excel_service
from .conversion_service import conversion_service
from .models import PDFOperation


def get_client_ip(request):
    """Get client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def log_operation(request, operation_type, input_size=0, output_size=0, 
                  processing_time=0, success=True, error_message=None):
    """Log PDF operation for analytics."""
    try:
        PDFOperation.objects.create(
            user=request.user if request.user.is_authenticated else None,
            operation_type=operation_type,
            input_file_size=input_size,
            output_file_size=output_size,
            processing_time=processing_time,
            success=success,
            error_message=error_message,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        )
    except Exception:
        pass


class PDFToolBaseView(APIView):
    """Base view for PDF tools with common functionality."""
    permission_classes = [AllowAny]  # Most tools are public
    parser_classes = [MultiPartParser, FormParser]

    def handle_error(self, request, operation_type, error, start_time):
        """Handle error response with logging."""
        log_operation(
            request, operation_type, 
            success=False, 
            error_message=str(error),
            processing_time=time.time() - start_time
        )
        return Response({
            'success': False,
            'message': str(error)
        }, status=status.HTTP_400_BAD_REQUEST)

    def create_file_response(self, data, filename, content_type='application/pdf'):
        """Create file download response."""
        response = HttpResponse(data, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    def create_zip_response(self, files, zip_filename):
        """Create ZIP file response for multiple files."""
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for data, filename in files:
                zip_file.writestr(filename, data)
        
        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer.read(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{zip_filename}"'
        return response


# ==================== MERGE PDF ====================
class MergePDFView(PDFToolBaseView):
    """Merge multiple PDFs into one."""

    def post(self, request):
        start_time = time.time()
        files = request.FILES.getlist('files')
        
        if len(files) < 2:
            return Response({
                'success': False,
                'message': 'At least 2 PDF files required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_files = [io.BytesIO(f.read()) for f in files]
            total_size = sum(f.size for f in files)
            
            pdf_data, filename = pdf_service.merge_pdfs(pdf_files)
            
            log_operation(
                request, 'merge',
                input_size=total_size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'merge', e, start_time)


# ==================== SPLIT PDF ====================
class SplitPDFView(PDFToolBaseView):
    """Split PDF into multiple files."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pages = request.data.get('pages')
            ranges = request.data.get('ranges')
            
            # Parse pages if string
            if isinstance(pages, str):
                pages = [int(p.strip()) for p in pages.split(',') if p.strip()]
            
            pdf_buffer = io.BytesIO(pdf_file.read())
            results = pdf_service.split_pdf(pdf_buffer, pages=pages, ranges=ranges)
            
            log_operation(
                request, 'split',
                input_size=pdf_file.size,
                output_size=sum(len(data) for data, _ in results),
                processing_time=time.time() - start_time
            )
            
            if len(results) == 1:
                return self.create_file_response(results[0][0], results[0][1])
            
            return self.create_zip_response(results, 'split_pages.zip')
            
        except Exception as e:
            return self.handle_error(request, 'split', e, start_time)


# ==================== COMPRESS PDF ====================
class CompressPDFView(PDFToolBaseView):
    """Compress PDF file."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        quality = request.data.get('quality', 'medium')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename, stats = pdf_service.compress_pdf(pdf_buffer, quality)
            
            log_operation(
                request, 'compress',
                input_size=stats['original_size'],
                output_size=stats['compressed_size'],
                processing_time=time.time() - start_time
            )
            
            response = self.create_file_response(pdf_data, filename)
            response['X-Original-Size'] = str(stats['original_size'])
            response['X-Compressed-Size'] = str(stats['compressed_size'])
            response['X-Reduction-Percent'] = str(stats['reduction_percent'])
            
            return response
            
        except Exception as e:
            return self.handle_error(request, 'compress', e, start_time)


# ==================== PROTECT PDF ====================
class ProtectPDFView(PDFToolBaseView):
    """Add password protection to PDF."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        user_password = request.data.get('userPassword', '')
        owner_password = request.data.get('ownerPassword', '')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not user_password:
            return Response({
                'success': False,
                'message': 'Password required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.protect_pdf(
                pdf_buffer, user_password, owner_password
            )
            
            log_operation(
                request, 'protect',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'protect', e, start_time)


# ==================== UNLOCK PDF ====================
class UnlockPDFView(PDFToolBaseView):
    """Remove password protection from PDF."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        password = request.data.get('password', '')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.unlock_pdf(pdf_buffer, password)
            
            log_operation(
                request, 'unlock',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'unlock', e, start_time)


# ==================== ROTATE PDF ====================
class RotatePDFView(PDFToolBaseView):
    """Rotate PDF pages."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        rotation = int(request.data.get('rotation', 90))
        pages = request.data.get('pages')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if isinstance(pages, str):
                pages = [int(p.strip()) for p in pages.split(',') if p.strip()]
            
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.rotate_pdf(pdf_buffer, rotation, pages)
            
            log_operation(
                request, 'rotate',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'rotate', e, start_time)


# ==================== ORGANIZE PDF ====================
class OrganizePDFView(PDFToolBaseView):
    """Reorder PDF pages."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        pages = request.data.get('pages')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Parse page order
            if isinstance(pages, str):
                import json
                pages = json.loads(pages)
            
            if not isinstance(pages, list) or not pages:
                return Response({
                    'success': False,
                    'message': 'Page order required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.organize_pdf(pdf_buffer, pages)
            
            log_operation(
                request, 'organize',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'organize', e, start_time)


# ==================== WATERMARK PDF ====================
class WatermarkPDFView(PDFToolBaseView):
    """Add watermark to PDF."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        text = request.data.get('text', 'WATERMARK')
        opacity = float(request.data.get('opacity', 0.3))
        position = request.data.get('position', 'center')
        font_size = int(request.data.get('fontSize', 50))
        color = request.data.get('color', '#888888')
        rotation = int(request.data.get('rotation', 45))
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.watermark_pdf(
                pdf_buffer, text, opacity, position, font_size, color, rotation
            )
            
            log_operation(
                request, 'watermark',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'watermark', e, start_time)


# ==================== PDF TO IMAGES ====================
class PDFToImagesView(PDFToolBaseView):
    """Convert PDF to images."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        dpi = int(request.data.get('dpi', 150))
        format_type = request.data.get('format', 'jpg')
        pages = request.data.get('pages')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if isinstance(pages, str) and pages:
                pages = [int(p.strip()) for p in pages.split(',') if p.strip()]
            
            pdf_buffer = io.BytesIO(pdf_file.read())
            results = pdf_service.pdf_to_images(pdf_buffer, dpi, format_type, pages)
            
            log_operation(
                request, 'pdf_to_jpg',
                input_size=pdf_file.size,
                output_size=sum(len(data) for data, _ in results),
                processing_time=time.time() - start_time
            )
            
            if len(results) == 1:
                content_type = 'image/png' if format_type == 'png' else 'image/jpeg'
                return self.create_file_response(results[0][0], results[0][1], content_type)
            
            return self.create_zip_response(results, f'images.zip')
            
        except Exception as e:
            return self.handle_error(request, 'pdf_to_jpg', e, start_time)


# ==================== IMAGES TO PDF ====================
class ImagesToPDFView(PDFToolBaseView):
    """Convert images to PDF."""

    def post(self, request):
        start_time = time.time()
        files = request.FILES.getlist('files')
        page_size = request.data.get('pageSize', 'A4')
        
        if not files:
            return Response({
                'success': False,
                'message': 'Image files required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image_buffers = [io.BytesIO(f.read()) for f in files]
            total_size = sum(f.size for f in files)
            
            pdf_data, filename = pdf_service.images_to_pdf(image_buffers, page_size)
            
            log_operation(
                request, 'jpg_to_pdf',
                input_size=total_size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'jpg_to_pdf', e, start_time)


# ==================== ADD PAGE NUMBERS ====================
class AddPageNumbersView(PDFToolBaseView):
    """Add page numbers to PDF."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        position = request.data.get('position', 'bottom-center')
        start_number = int(request.data.get('startNumber', 1))
        format_str = request.data.get('format', '{n}')
        font_size = int(request.data.get('fontSize', 12))
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.add_page_numbers(
                pdf_buffer, position, start_number, format_str, font_size
            )
            
            log_operation(
                request, 'page_numbers',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'page_numbers', e, start_time)


# ==================== SIGN PDF ====================
class SignPDFView(PDFToolBaseView):
    """Add signature to PDF."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        signature_image = request.FILES.get('signature')
        page = int(request.data.get('page', 1))
        x = float(request.data.get('x', 100))
        y = float(request.data.get('y', 100))
        width = float(request.data.get('width', 150))
        height = float(request.data.get('height', 50))
        
        if not pdf_file or not signature_image:
            return Response({
                'success': False,
                'message': 'PDF file and signature image required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            sig_buffer = io.BytesIO(signature_image.read())
            
            pdf_data, filename = pdf_service.sign_pdf(
                pdf_buffer, sig_buffer, page, x, y, width, height
            )
            
            log_operation(
                request, 'sign',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'sign', e, start_time)


# ==================== REPAIR PDF ====================
class RepairPDFView(PDFToolBaseView):
    """Repair corrupted PDF."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.repair_pdf(pdf_buffer)
            
            log_operation(
                request, 'repair',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'repair', e, start_time)


# ==================== PDF TO PDF/A ====================
class PDFToPDFAView(PDFToolBaseView):
    """Convert PDF to PDF/A format."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            pdf_data, filename = pdf_service.convert_to_pdfa(pdf_buffer)
            
            log_operation(
                request, 'pdf_a',
                input_size=pdf_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'pdf_a', e, start_time)


# ==================== PDF TO EXCEL ====================
class AnalyzePDFView(PDFToolBaseView):
    """Analyze PDF for Excel conversion."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('pdf') or request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            result = pdf_to_excel_service.analyze_pdf(pdf_buffer)
            
            return Response({
                'success': True,
                'message': 'PDF analyzed successfully',
                'data': result
            })
            
        except Exception as e:
            return self.handle_error(request, 'pdf_to_excel', e, start_time)


class GenerateExcelView(PDFToolBaseView):
    """Generate Excel from analyzed PDF."""

    def post(self, request):
        start_time = time.time()
        analysis_id = request.data.get('analysisId')
        selected_columns = request.data.get('selectedColumns', [])
        
        if not analysis_id or not selected_columns:
            return Response({
                'success': False,
                'message': 'Analysis ID and selected columns required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            excel_data, filename, stats = pdf_to_excel_service.generate_excel(
                analysis_id, selected_columns
            )
            
            log_operation(
                request, 'pdf_to_excel',
                output_size=len(excel_data),
                processing_time=time.time() - start_time
            )
            
            response = self.create_file_response(
                excel_data, filename,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
            return response
            
        except Exception as e:
            return self.handle_error(request, 'pdf_to_excel', e, start_time)


# ==================== DOCUMENT CONVERSIONS ====================
class PDFToWordView(PDFToolBaseView):
    """Convert PDF to Word."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            doc_data, filename = conversion_service.pdf_to_word(pdf_buffer)
            
            log_operation(
                request, 'pdf_to_word',
                input_size=pdf_file.size,
                output_size=len(doc_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(
                doc_data, filename,
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
            
        except Exception as e:
            return self.handle_error(request, 'pdf_to_word', e, start_time)


class WordToPDFView(PDFToolBaseView):
    """Convert Word to PDF."""

    def post(self, request):
        start_time = time.time()
        word_file = request.FILES.get('file')
        
        if not word_file:
            return Response({
                'success': False,
                'message': 'Word file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            word_buffer = io.BytesIO(word_file.read())
            pdf_data, filename = conversion_service.word_to_pdf(
                word_buffer, word_file.name
            )
            
            log_operation(
                request, 'word_to_pdf',
                input_size=word_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'word_to_pdf', e, start_time)


class PDFToPPTView(PDFToolBaseView):
    """Convert PDF to PowerPoint."""

    def post(self, request):
        start_time = time.time()
        pdf_file = request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            ppt_data, filename = conversion_service.pdf_to_pptx(pdf_buffer)
            
            log_operation(
                request, 'pdf_to_ppt',
                input_size=pdf_file.size,
                output_size=len(ppt_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(
                ppt_data, filename,
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            )
            
        except Exception as e:
            return self.handle_error(request, 'pdf_to_ppt', e, start_time)


class PPTToPDFView(PDFToolBaseView):
    """Convert PowerPoint to PDF."""

    def post(self, request):
        start_time = time.time()
        ppt_file = request.FILES.get('file')
        
        if not ppt_file:
            return Response({
                'success': False,
                'message': 'PowerPoint file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ppt_buffer = io.BytesIO(ppt_file.read())
            pdf_data, filename = conversion_service.pptx_to_pdf(ppt_buffer)
            
            log_operation(
                request, 'ppt_to_pdf',
                input_size=ppt_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'ppt_to_pdf', e, start_time)


class ExcelToPDFView(PDFToolBaseView):
    """Convert Excel to PDF."""

    def post(self, request):
        start_time = time.time()
        excel_file = request.FILES.get('file')
        
        if not excel_file:
            return Response({
                'success': False,
                'message': 'Excel file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            excel_buffer = io.BytesIO(excel_file.read())
            pdf_data, filename = conversion_service.excel_to_pdf(excel_buffer)
            
            log_operation(
                request, 'excel_to_pdf',
                input_size=excel_file.size,
                output_size=len(pdf_data),
                processing_time=time.time() - start_time
            )
            
            return self.create_file_response(pdf_data, filename)
            
        except Exception as e:
            return self.handle_error(request, 'excel_to_pdf', e, start_time)


# ==================== PDF INFO ====================
class PDFInfoView(PDFToolBaseView):
    """Get PDF information."""

    def post(self, request):
        pdf_file = request.FILES.get('file')
        
        if not pdf_file:
            return Response({
                'success': False,
                'message': 'PDF file required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pdf_buffer = io.BytesIO(pdf_file.read())
            info = pdf_service.get_pdf_info(pdf_buffer)
            
            return Response({
                'success': True,
                'data': info
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


# ==================== TEST ENDPOINT ====================
class PDFToolsTestView(APIView):
    """Test endpoint for PDF tools API."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'success': True,
            'message': 'HAMROpdf API is running',
            'version': '2.0.0',
            'endpoints': {
                'merge': 'POST /api/pdf/merge/',
                'split': 'POST /api/pdf/split/',
                'compress': 'POST /api/pdf/compress/',
                'protect': 'POST /api/pdf/protect/',
                'unlock': 'POST /api/pdf/unlock/',
                'rotate': 'POST /api/pdf/rotate/',
                'organize': 'POST /api/pdf/organize/',
                'watermark': 'POST /api/pdf/watermark/',
                'pdf_to_jpg': 'POST /api/pdf/pdf-to-jpg/',
                'jpg_to_pdf': 'POST /api/pdf/jpg-to-pdf/',
                'page_numbers': 'POST /api/pdf/page-numbers/',
                'sign': 'POST /api/pdf/sign/',
                'repair': 'POST /api/pdf/repair/',
                'pdf_a': 'POST /api/pdf/pdf-a/',
                'pdf_to_word': 'POST /api/pdf/pdf-to-word/',
                'word_to_pdf': 'POST /api/pdf/word-to-pdf/',
                'pdf_to_ppt': 'POST /api/pdf/pdf-to-ppt/',
                'ppt_to_pdf': 'POST /api/pdf/ppt-to-pdf/',
                'excel_to_pdf': 'POST /api/pdf/excel-to-pdf/',
                'analyze': 'POST /api/pdf/analyze/',
                'generate': 'POST /api/pdf/generate/',
                'info': 'POST /api/pdf/info/',
            }
        })
