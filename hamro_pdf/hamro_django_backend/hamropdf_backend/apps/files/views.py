"""
Views for Files app.
"""

import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, HttpResponse
from django.conf import settings

from .models import File
from .serializers import FileSerializer
from apps.users.permissions import IsAdminOrOwner


class FileUploadView(APIView):
    """Upload a file."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        
        if not uploaded_file:
            return Response({
                'success': False,
                'message': 'No file uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check file type
        if uploaded_file.content_type != 'application/pdf':
            return Response({
                'success': False,
                'message': 'Only PDF files are allowed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check file size (10MB limit)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({
                'success': False,
                'message': 'File size exceeds 10MB limit'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save file
        import uuid
        filename = f"{uuid.uuid4()}_{uploaded_file.name}"
        file_path = os.path.join(settings.MEDIA_ROOT, 'user-files', filename)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'wb') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)
        
        # Create database record
        file_obj = File.objects.create(
            user=request.user,
            file_name=uploaded_file.name,
            file_size=uploaded_file.size,
            file_path=file_path,
            mime_type=uploaded_file.content_type
        )
        
        return Response({
            'success': True,
            'message': 'File uploaded successfully',
            'file': FileSerializer(file_obj).data
        }, status=status.HTTP_201_CREATED)


class UserFilesView(APIView):
    """Get all files for a user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # Check authorization
        if str(request.user.id) != str(user_id) and request.user.role != 'admin':
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        files = File.objects.filter(user_id=user_id)
        
        return Response({
            'success': True,
            'message': 'Files retrieved successfully',
            'files': FileSerializer(files, many=True).data
        })


class FileDetailView(APIView):
    """Get, update, or delete a specific file."""
    permission_classes = [IsAuthenticated]

    def get_object(self, file_id):
        try:
            return File.objects.get(id=file_id)
        except File.DoesNotExist:
            return None

    def get(self, request, file_id):
        file_obj = self.get_object(file_id)
        
        if not file_obj:
            return Response({
                'success': False,
                'message': 'File not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'message': 'File retrieved successfully',
            'file': FileSerializer(file_obj).data
        })

    def put(self, request, file_id):
        file_obj = self.get_object(file_id)
        
        if not file_obj:
            return Response({
                'success': False,
                'message': 'File not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check authorization
        if file_obj.user_id != request.user.id and request.user.role != 'admin':
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        file_name = request.data.get('fileName')
        if file_name:
            file_obj.file_name = file_name
            file_obj.save()
        
        return Response({
            'success': True,
            'message': 'File updated successfully',
            'file': FileSerializer(file_obj).data
        })

    def delete(self, request, file_id):
        file_obj = self.get_object(file_id)
        
        if not file_obj:
            return Response({
                'success': False,
                'message': 'File not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check authorization
        if file_obj.user_id != request.user.id and request.user.role != 'admin':
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Delete physical file
        if os.path.exists(file_obj.file_path):
            os.remove(file_obj.file_path)
        
        file_obj.delete()
        
        return Response({
            'success': True,
            'message': 'File deleted successfully'
        })


class FileDownloadView(APIView):
    """Download a file."""
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        try:
            file_obj = File.objects.get(id=file_id)
        except File.DoesNotExist:
            return Response({
                'success': False,
                'message': 'File not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not os.path.exists(file_obj.file_path):
            return Response({
                'success': False,
                'message': 'File not found on server'
            }, status=status.HTTP_404_NOT_FOUND)
        
        response = FileResponse(
            open(file_obj.file_path, 'rb'),
            content_type=file_obj.mime_type
        )
        response['Content-Disposition'] = f'attachment; filename="{file_obj.file_name}"'
        return response


class FileViewView(APIView):
    """View/stream a file."""
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        try:
            file_obj = File.objects.get(id=file_id)
        except File.DoesNotExist:
            return Response({
                'success': False,
                'message': 'File not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not os.path.exists(file_obj.file_path):
            return Response({
                'success': False,
                'message': 'File not found on server'
            }, status=status.HTTP_404_NOT_FOUND)
        
        response = FileResponse(
            open(file_obj.file_path, 'rb'),
            content_type=file_obj.mime_type
        )
        response['Content-Disposition'] = f'inline; filename="{file_obj.file_name}"'
        return response
