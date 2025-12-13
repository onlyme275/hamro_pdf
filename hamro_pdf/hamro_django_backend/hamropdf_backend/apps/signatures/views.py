"""
Views for Signatures app.
"""

import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from django.http import FileResponse

from .models import Signature, UserSignature
from .serializers import SignatureSerializer, SignatureCreateSerializer, UserSignatureSerializer


class SignatureListCreateView(APIView):
    """List or create signatures for authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        signatures = Signature.objects.filter(user=request.user)
        return Response({
            'success': True,
            'count': signatures.count(),
            'data': SignatureSerializer(signatures, many=True).data
        })

    def post(self, request):
        serializer = SignatureCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # If setting as default, unset others
            if serializer.validated_data.get('is_default'):
                Signature.objects.filter(user=request.user, is_default=True).update(is_default=False)
            
            signature = serializer.save(user=request.user)
            return Response({
                'success': True,
                'message': 'Signature created successfully',
                'data': SignatureSerializer(signature).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class SignatureDetailView(APIView):
    """Get, update, or delete a specific signature."""
    permission_classes = [IsAuthenticated]

    def get_object(self, signature_id, user):
        try:
            return Signature.objects.get(id=signature_id, user=user)
        except Signature.DoesNotExist:
            return None

    def get(self, request, signature_id):
        signature = self.get_object(signature_id, request.user)
        if not signature:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'data': SignatureSerializer(signature).data
        })

    def put(self, request, signature_id):
        signature = self.get_object(signature_id, request.user)
        if not signature:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # If setting as default, unset others
        if request.data.get('is_default'):
            Signature.objects.filter(user=request.user, is_default=True).exclude(id=signature_id).update(is_default=False)
        
        serializer = SignatureCreateSerializer(signature, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Signature updated successfully',
                'data': SignatureSerializer(signature).data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, signature_id):
        signature = self.get_object(signature_id, request.user)
        if not signature:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        signature.delete()
        return Response({
            'success': True,
            'message': 'Signature deleted successfully'
        })


class DefaultSignatureView(APIView):
    """Get user's default signature."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        signature = Signature.objects.filter(user=request.user, is_default=True).first()
        if not signature:
            return Response({
                'success': False,
                'message': 'No default signature found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'data': SignatureSerializer(signature).data
        })


class SetDefaultSignatureView(APIView):
    """Set a signature as default."""
    permission_classes = [IsAuthenticated]

    def post(self, request, signature_id):
        try:
            signature = Signature.objects.get(id=signature_id, user=request.user)
        except Signature.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Unset other defaults
        Signature.objects.filter(user=request.user, is_default=True).update(is_default=False)
        
        signature.is_default = True
        signature.save()
        
        return Response({
            'success': True,
            'message': 'Default signature updated successfully',
            'data': SignatureSerializer(signature).data
        })


# ==================== User Signature Files ====================

class UserSignatureUploadView(APIView):
    """Upload signature image file."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        signature_file = request.FILES.get('signature')
        
        if not signature_file:
            return Response({
                'success': False,
                'message': 'No signature uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check file type
        if not signature_file.content_type.startswith('image/'):
            return Response({
                'success': False,
                'message': 'Only image files are allowed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save file
        import uuid
        ext = os.path.splitext(signature_file.name)[1]
        filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(settings.MEDIA_ROOT, 'user-signatures', filename)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'wb') as f:
            for chunk in signature_file.chunks():
                f.write(chunk)
        
        signature_url = f"/uploads/user-signatures/{filename}"
        
        user_sig = UserSignature.objects.create(
            user=request.user,
            signature_url=signature_url,
            file_path=file_path
        )
        
        return Response({
            'success': True,
            'message': 'Signature uploaded successfully',
            'signature': UserSignatureSerializer(user_sig).data
        }, status=status.HTTP_201_CREATED)


class UserSignatureListView(APIView):
    """List all signature files for a user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if str(request.user.id) != str(user_id) and request.user.role != 'admin':
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        signatures = UserSignature.objects.filter(user_id=user_id)
        return Response({
            'success': True,
            'message': 'Signatures retrieved successfully',
            'signatures': UserSignatureSerializer(signatures, many=True).data
        })


class UserSignatureDetailView(APIView):
    """Get or delete a signature file."""
    permission_classes = [IsAuthenticated]

    def get(self, request, signature_id):
        try:
            signature = UserSignature.objects.get(id=signature_id)
        except UserSignature.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'signature': UserSignatureSerializer(signature).data
        })

    def delete(self, request, signature_id):
        try:
            signature = UserSignature.objects.get(id=signature_id, user=request.user)
        except UserSignature.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Delete file
        if os.path.exists(signature.file_path):
            os.remove(signature.file_path)
        
        signature.delete()
        return Response({
            'success': True,
            'message': 'Signature deleted successfully'
        })


class UserSignatureViewView(APIView):
    """View/stream a signature image."""
    permission_classes = [IsAuthenticated]

    def get(self, request, signature_id):
        try:
            signature = UserSignature.objects.get(id=signature_id)
        except UserSignature.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Signature not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not os.path.exists(signature.file_path):
            return Response({
                'success': False,
                'message': 'Signature file not found on server'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Determine content type
        ext = os.path.splitext(signature.file_path)[1].lower()
        content_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        }
        content_type = content_types.get(ext, 'image/png')
        
        return FileResponse(
            open(signature.file_path, 'rb'),
            content_type=content_type
        )
