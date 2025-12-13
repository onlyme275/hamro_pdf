"""
PDF Processing Services for HAMROpdf.
All PDF manipulation logic is centralized here.
"""

import os
import io
import uuid
import time
import tempfile
import subprocess
from pathlib import Path
from typing import List, Tuple, Optional, Dict, Any
from datetime import datetime

from django.conf import settings
from PIL import Image
import fitz  # PyMuPDF
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


class PDFService:
    """Main PDF processing service."""

    def __init__(self):
        self.temp_dir = settings.PDF_TEMP_DIR
        self.output_dir = settings.PDF_OUTPUT_DIR
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _get_temp_path(self, suffix='.pdf') -> Path:
        """Generate a temporary file path."""
        return self.temp_dir / f"{uuid.uuid4()}{suffix}"

    def _get_output_path(self, filename: str) -> Path:
        """Generate an output file path."""
        return self.output_dir / filename

    def _cleanup_files(self, *paths):
        """Clean up temporary files."""
        for path in paths:
            try:
                if path and Path(path).exists():
                    Path(path).unlink()
            except Exception:
                pass

    # ==================== MERGE PDF ====================
    def merge_pdfs(self, pdf_files: List[io.BytesIO], output_filename: str = None) -> Tuple[bytes, str]:
        """
        Merge multiple PDF files into one.
        
        Args:
            pdf_files: List of PDF file-like objects
            output_filename: Optional output filename
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        start_time = time.time()
        
        writer = PdfWriter()
        
        for pdf_file in pdf_files:
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                writer.add_page(page)
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        filename = output_filename or f"merged_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return output.read(), filename

    # ==================== SPLIT PDF ====================
    def split_pdf(self, pdf_file: io.BytesIO, pages: List[int] = None, 
                  ranges: List[Tuple[int, int]] = None) -> List[Tuple[bytes, str]]:
        """
        Split PDF into multiple files.
        
        Args:
            pdf_file: PDF file-like object
            pages: List of specific page numbers to extract
            ranges: List of (start, end) tuples for page ranges
            
        Returns:
            List of (pdf_bytes, filename) tuples
        """
        reader = PdfReader(pdf_file)
        total_pages = len(reader.pages)
        results = []
        
        if pages:
            # Extract specific pages
            for page_num in pages:
                if 1 <= page_num <= total_pages:
                    writer = PdfWriter()
                    writer.add_page(reader.pages[page_num - 1])
                    
                    output = io.BytesIO()
                    writer.write(output)
                    output.seek(0)
                    
                    filename = f"page_{page_num}.pdf"
                    results.append((output.read(), filename))
        
        elif ranges:
            # Extract page ranges
            for i, (start, end) in enumerate(ranges):
                writer = PdfWriter()
                for page_num in range(max(1, start) - 1, min(end, total_pages)):
                    writer.add_page(reader.pages[page_num])
                
                output = io.BytesIO()
                writer.write(output)
                output.seek(0)
                
                filename = f"pages_{start}-{end}.pdf"
                results.append((output.read(), filename))
        
        else:
            # Split into individual pages
            for i, page in enumerate(reader.pages, 1):
                writer = PdfWriter()
                writer.add_page(page)
                
                output = io.BytesIO()
                writer.write(output)
                output.seek(0)
                
                filename = f"page_{i}.pdf"
                results.append((output.read(), filename))
        
        return results

    # ==================== COMPRESS PDF ====================
    def compress_pdf(self, pdf_file: io.BytesIO, quality: str = 'medium') -> Tuple[bytes, str, dict]:
        """
        Compress PDF file.
        
        Args:
            pdf_file: PDF file-like object
            quality: 'low', 'medium', 'high'
            
        Returns:
            Tuple of (pdf_bytes, filename, stats)
        """
        # Quality settings
        quality_settings = {
            'low': {'image_quality': 30, 'dpi': 72},
            'medium': {'image_quality': 50, 'dpi': 100},
            'high': {'image_quality': 75, 'dpi': 150},
        }
        settings_used = quality_settings.get(quality, quality_settings['medium'])
        
        original_size = pdf_file.seek(0, 2)
        pdf_file.seek(0)
        
        # Use PyMuPDF for compression
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        
        # Compress images in the PDF
        for page in doc:
            image_list = page.get_images()
            for img_index, img in enumerate(image_list):
                xref = img[0]
                try:
                    # Get image
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    
                    # Compress image
                    image = Image.open(io.BytesIO(image_bytes))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    
                    # Resize if needed
                    max_dim = settings_used['dpi'] * 10
                    if max(image.size) > max_dim:
                        ratio = max_dim / max(image.size)
                        new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                        image = image.resize(new_size, Image.LANCZOS)
                    
                    # Save compressed
                    img_buffer = io.BytesIO()
                    image.save(img_buffer, format='JPEG', quality=settings_used['image_quality'], optimize=True)
                    img_buffer.seek(0)
                    
                except Exception:
                    continue
        
        # Save with garbage collection
        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True, clean=True)
        doc.close()
        output.seek(0)
        
        compressed_data = output.read()
        compressed_size = len(compressed_data)
        
        stats = {
            'original_size': original_size,
            'compressed_size': compressed_size,
            'reduction_percent': round((1 - compressed_size / original_size) * 100, 2) if original_size > 0 else 0
        }
        
        filename = f"compressed_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return compressed_data, filename, stats

    # ==================== PROTECT PDF ====================
    def protect_pdf(self, pdf_file: io.BytesIO, user_password: str, 
                    owner_password: str = None, permissions: dict = None) -> Tuple[bytes, str]:
        """
        Add password protection to PDF.
        
        Args:
            pdf_file: PDF file-like object
            user_password: Password for opening the PDF
            owner_password: Password for editing (defaults to user_password)
            permissions: Dict of permissions to set
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        if not owner_password:
            owner_password = user_password
        
        # Save input to temp file for qpdf
        input_path = self._get_temp_path()
        output_path = self._get_temp_path()
        
        try:
            with open(input_path, 'wb') as f:
                f.write(pdf_file.read())
            
            # Use qpdf for encryption (more reliable)
            cmd = [
                'qpdf', '--encrypt', user_password, owner_password, '256',
                '--', str(input_path), str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0 and not output_path.exists():
                raise Exception(f"qpdf error: {result.stderr}")
            
            with open(output_path, 'rb') as f:
                pdf_data = f.read()
            
            filename = f"protected_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            return pdf_data, filename
            
        finally:
            self._cleanup_files(input_path, output_path)

    # ==================== UNLOCK PDF ====================
    def unlock_pdf(self, pdf_file: io.BytesIO, password: str) -> Tuple[bytes, str]:
        """
        Remove password protection from PDF.
        
        Args:
            pdf_file: PDF file-like object
            password: Password to unlock
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        input_path = self._get_temp_path()
        output_path = self._get_temp_path()
        
        try:
            with open(input_path, 'wb') as f:
                f.write(pdf_file.read())
            
            cmd = [
                'qpdf', '--password=' + password, '--decrypt',
                str(input_path), str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                raise Exception("Failed to unlock PDF. Check password.")
            
            with open(output_path, 'rb') as f:
                pdf_data = f.read()
            
            filename = f"unlocked_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            return pdf_data, filename
            
        finally:
            self._cleanup_files(input_path, output_path)

    # ==================== ROTATE PDF ====================
    def rotate_pdf(self, pdf_file: io.BytesIO, rotation: int, 
                   pages: List[int] = None) -> Tuple[bytes, str]:
        """
        Rotate PDF pages.
        
        Args:
            pdf_file: PDF file-like object
            rotation: Degrees to rotate (90, 180, 270)
            pages: Specific pages to rotate (1-indexed), None for all
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        reader = PdfReader(pdf_file)
        writer = PdfWriter()
        
        for i, page in enumerate(reader.pages, 1):
            if pages is None or i in pages:
                page.rotate(rotation)
            writer.add_page(page)
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        filename = f"rotated_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return output.read(), filename

    # ==================== ORGANIZE PDF (Reorder Pages) ====================
    def organize_pdf(self, pdf_file: io.BytesIO, page_order: List[int]) -> Tuple[bytes, str]:
        """
        Reorder PDF pages.
        
        Args:
            pdf_file: PDF file-like object
            page_order: List of page numbers in desired order (1-indexed)
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        reader = PdfReader(pdf_file)
        writer = PdfWriter()
        
        for page_num in page_order:
            if 1 <= page_num <= len(reader.pages):
                writer.add_page(reader.pages[page_num - 1])
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        filename = f"reordered_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return output.read(), filename

    # ==================== WATERMARK PDF ====================
    def watermark_pdf(self, pdf_file: io.BytesIO, watermark_text: str,
                      opacity: float = 0.3, position: str = 'center',
                      font_size: int = 50, color: str = '#888888',
                      rotation: int = 45) -> Tuple[bytes, str]:
        """
        Add text watermark to PDF.
        
        Args:
            pdf_file: PDF file-like object
            watermark_text: Text to use as watermark
            opacity: Watermark opacity (0-1)
            position: 'center', 'top', 'bottom'
            font_size: Font size for watermark
            color: Hex color code
            rotation: Rotation angle in degrees
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        reader = PdfReader(pdf_file)
        writer = PdfWriter()
        
        # Parse color
        color = color.lstrip('#')
        r, g, b = tuple(int(color[i:i+2], 16) / 255 for i in (0, 2, 4))
        
        for page in reader.pages:
            # Get page dimensions
            page_width = float(page.mediabox.width)
            page_height = float(page.mediabox.height)
            
            # Create watermark
            watermark_buffer = io.BytesIO()
            c = canvas.Canvas(watermark_buffer, pagesize=(page_width, page_height))
            
            c.saveState()
            c.setFillColorRGB(r, g, b, opacity)
            c.setFont("Helvetica", font_size)
            
            # Calculate position
            text_width = c.stringWidth(watermark_text, "Helvetica", font_size)
            
            if position == 'center':
                x = page_width / 2
                y = page_height / 2
            elif position == 'top':
                x = page_width / 2
                y = page_height - 100
            else:  # bottom
                x = page_width / 2
                y = 100
            
            c.translate(x, y)
            c.rotate(rotation)
            c.drawCentredString(0, 0, watermark_text)
            c.restoreState()
            c.save()
            
            watermark_buffer.seek(0)
            watermark_reader = PdfReader(watermark_buffer)
            watermark_page = watermark_reader.pages[0]
            
            # Merge watermark with page
            page.merge_page(watermark_page)
            writer.add_page(page)
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        filename = f"watermarked_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return output.read(), filename

    # ==================== PDF TO IMAGES ====================
    def pdf_to_images(self, pdf_file: io.BytesIO, dpi: int = 150,
                      format: str = 'jpg', pages: List[int] = None) -> List[Tuple[bytes, str]]:
        """
        Convert PDF pages to images.
        
        Args:
            pdf_file: PDF file-like object
            dpi: Image resolution
            format: Output format ('jpg', 'png')
            pages: Specific pages to convert (1-indexed), None for all
            
        Returns:
            List of (image_bytes, filename) tuples
        """
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        results = []
        
        zoom = dpi / 72
        matrix = fitz.Matrix(zoom, zoom)
        
        for i, page in enumerate(doc, 1):
            if pages is not None and i not in pages:
                continue
            
            pix = page.get_pixmap(matrix=matrix)
            
            if format.lower() == 'png':
                img_data = pix.tobytes("png")
                filename = f"page_{i}.png"
            else:
                # Convert to JPEG
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                img_buffer = io.BytesIO()
                img.save(img_buffer, format='JPEG', quality=90)
                img_data = img_buffer.getvalue()
                filename = f"page_{i}.jpg"
            
            results.append((img_data, filename))
        
        doc.close()
        return results

    # ==================== IMAGES TO PDF ====================
    def images_to_pdf(self, image_files: List[io.BytesIO], 
                      page_size: str = 'A4') -> Tuple[bytes, str]:
        """
        Convert images to PDF.
        
        Args:
            image_files: List of image file-like objects
            page_size: 'A4', 'Letter', or 'fit'
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        page_sizes = {
            'A4': A4,
            'Letter': letter,
        }
        
        images = []
        for img_file in image_files:
            img = Image.open(img_file)
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            images.append(img)
        
        output = io.BytesIO()
        
        if page_size == 'fit':
            # Use first image size as page size
            images[0].save(
                output, format='PDF', save_all=True, 
                append_images=images[1:] if len(images) > 1 else []
            )
        else:
            # Create PDF with specified page size
            target_size = page_sizes.get(page_size, A4)
            c = canvas.Canvas(output, pagesize=target_size)
            
            for img in images:
                # Calculate scaling to fit page
                img_width, img_height = img.size
                page_width, page_height = target_size
                
                scale = min(page_width / img_width, page_height / img_height) * 0.95
                new_width = img_width * scale
                new_height = img_height * scale
                
                x = (page_width - new_width) / 2
                y = (page_height - new_height) / 2
                
                # Save image temporarily
                img_buffer = io.BytesIO()
                img.save(img_buffer, format='JPEG')
                img_buffer.seek(0)
                
                from reportlab.lib.utils import ImageReader
                c.drawImage(ImageReader(img_buffer), x, y, new_width, new_height)
                c.showPage()
            
            c.save()
        
        output.seek(0)
        filename = f"images_to_pdf_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return output.read(), filename

    # ==================== ADD PAGE NUMBERS ====================
    def add_page_numbers(self, pdf_file: io.BytesIO, position: str = 'bottom-center',
                         start_number: int = 1, format_str: str = '{n}',
                         font_size: int = 12) -> Tuple[bytes, str]:
        """
        Add page numbers to PDF.
        
        Args:
            pdf_file: PDF file-like object
            position: 'bottom-center', 'bottom-right', 'bottom-left', 'top-center', etc.
            start_number: Starting page number
            format_str: Format string with {n} for page number and {total} for total pages
            font_size: Font size for page numbers
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        reader = PdfReader(pdf_file)
        writer = PdfWriter()
        total_pages = len(reader.pages)
        
        for i, page in enumerate(reader.pages):
            page_width = float(page.mediabox.width)
            page_height = float(page.mediabox.height)
            
            # Create page number overlay
            overlay_buffer = io.BytesIO()
            c = canvas.Canvas(overlay_buffer, pagesize=(page_width, page_height))
            
            page_num = start_number + i
            text = format_str.format(n=page_num, total=total_pages)
            
            c.setFont("Helvetica", font_size)
            text_width = c.stringWidth(text, "Helvetica", font_size)
            
            # Calculate position
            positions = {
                'bottom-center': (page_width / 2 - text_width / 2, 30),
                'bottom-right': (page_width - text_width - 30, 30),
                'bottom-left': (30, 30),
                'top-center': (page_width / 2 - text_width / 2, page_height - 30),
                'top-right': (page_width - text_width - 30, page_height - 30),
                'top-left': (30, page_height - 30),
            }
            
            x, y = positions.get(position, positions['bottom-center'])
            c.drawString(x, y, text)
            c.save()
            
            overlay_buffer.seek(0)
            overlay_reader = PdfReader(overlay_buffer)
            page.merge_page(overlay_reader.pages[0])
            writer.add_page(page)
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        filename = f"numbered_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return output.read(), filename

    # ==================== SIGN PDF ====================
    def sign_pdf(self, pdf_file: io.BytesIO, signature_image: io.BytesIO,
                 page: int = 1, x: float = 100, y: float = 100,
                 width: float = 150, height: float = 50) -> Tuple[bytes, str]:
        """
        Add signature image to PDF.
        
        Args:
            pdf_file: PDF file-like object
            signature_image: Signature image file-like object
            page: Page number to add signature (1-indexed)
            x, y: Position of signature
            width, height: Size of signature
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        
        if page < 1 or page > len(doc):
            page = 1
        
        target_page = doc[page - 1]
        
        # Insert image
        signature_data = signature_image.read()
        rect = fitz.Rect(x, y, x + width, y + height)
        target_page.insert_image(rect, stream=signature_data)
        
        output = io.BytesIO()
        doc.save(output)
        doc.close()
        output.seek(0)
        
        filename = f"signed_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return output.read(), filename

    # ==================== REPAIR PDF ====================
    def repair_pdf(self, pdf_file: io.BytesIO) -> Tuple[bytes, str]:
        """
        Attempt to repair a corrupted PDF.
        
        Args:
            pdf_file: PDF file-like object
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        input_path = self._get_temp_path()
        output_path = self._get_temp_path()
        
        try:
            with open(input_path, 'wb') as f:
                f.write(pdf_file.read())
            
            # Try using qpdf to repair
            cmd = ['qpdf', '--linearize', str(input_path), str(output_path)]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if output_path.exists():
                with open(output_path, 'rb') as f:
                    pdf_data = f.read()
            else:
                # Fallback: try PyMuPDF
                doc = fitz.open(str(input_path))
                output_buffer = io.BytesIO()
                doc.save(output_buffer, garbage=4, deflate=True)
                doc.close()
                output_buffer.seek(0)
                pdf_data = output_buffer.read()
            
            filename = f"repaired_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            return pdf_data, filename
            
        finally:
            self._cleanup_files(input_path, output_path)

    # ==================== PDF TO PDF/A ====================
    def convert_to_pdfa(self, pdf_file: io.BytesIO) -> Tuple[bytes, str]:
        """
        Convert PDF to PDF/A format for archival.
        
        Args:
            pdf_file: PDF file-like object
            
        Returns:
            Tuple of (pdf_bytes, filename)
        """
        input_path = self._get_temp_path()
        output_path = self._get_temp_path()
        
        try:
            with open(input_path, 'wb') as f:
                f.write(pdf_file.read())
            
            # Use ghostscript for PDF/A conversion
            cmd = [
                'gs', '-dPDFA', '-dBATCH', '-dNOPAUSE',
                '-sColorConversionStrategy=UseDeviceIndependentColor',
                '-sDEVICE=pdfwrite',
                '-dPDFACompatibilityPolicy=1',
                f'-sOutputFile={output_path}',
                str(input_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if not output_path.exists():
                raise Exception("Failed to convert to PDF/A")
            
            with open(output_path, 'rb') as f:
                pdf_data = f.read()
            
            filename = f"pdfa_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            return pdf_data, filename
            
        finally:
            self._cleanup_files(input_path, output_path)

    # ==================== GET PDF INFO ====================
    def get_pdf_info(self, pdf_file: io.BytesIO) -> Dict[str, Any]:
        """
        Get PDF metadata and information.
        
        Args:
            pdf_file: PDF file-like object
            
        Returns:
            Dictionary with PDF information
        """
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        
        info = {
            'page_count': len(doc),
            'metadata': doc.metadata,
            'is_encrypted': doc.is_encrypted,
            'pages': []
        }
        
        for i, page in enumerate(doc, 1):
            info['pages'].append({
                'number': i,
                'width': page.rect.width,
                'height': page.rect.height,
                'rotation': page.rotation
            })
        
        doc.close()
        return info


# Create singleton instance
pdf_service = PDFService()
