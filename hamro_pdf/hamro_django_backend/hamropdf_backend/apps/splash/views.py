"""
Views for Splash app.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count

from .models import Splash
from .serializers import SplashSerializer, SplashCreateSerializer
from apps.users.permissions import IsAdmin


class ActiveSplashView(APIView):
    """Get active splash screens (public)."""
    permission_classes = [AllowAny]

    def get(self, request):
        now = timezone.now()
        
        splashes = Splash.objects.filter(
            is_active=True
        ).filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now)
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=now)
        )
        
        return Response({
            'success': True,
            'splash': SplashSerializer(splashes, many=True).data,
            'count': splashes.count()
        })


class SplashListCreateView(APIView):
    """List all or create splash screen (admin only)."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        splashes = Splash.objects.all()
        return Response({
            'success': True,
            'splash': SplashSerializer(splashes, many=True).data,
            'count': splashes.count()
        })

    def post(self, request):
        serializer = SplashCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            splash = serializer.save()
            return Response({
                'success': True,
                'message': 'Splash screen created successfully',
                'splash': SplashSerializer(splash).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'error': 'Failed to create splash screen',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class SplashDetailView(APIView):
    """Get, update, or delete a specific splash screen."""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdmin()]

    def get_object(self, splash_id):
        try:
            return Splash.objects.get(id=splash_id)
        except Splash.DoesNotExist:
            return None

    def get(self, request, splash_id):
        splash = self.get_object(splash_id)
        if not splash:
            return Response({
                'success': False,
                'error': 'Splash screen not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'splash': SplashSerializer(splash).data
        })

    def put(self, request, splash_id):
        splash = self.get_object(splash_id)
        if not splash:
            return Response({
                'success': False,
                'error': 'Splash screen not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SplashCreateSerializer(splash, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Splash screen updated successfully',
                'splash': SplashSerializer(splash).data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, splash_id):
        splash = self.get_object(splash_id)
        if not splash:
            return Response({
                'success': False,
                'error': 'Splash screen not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        splash.delete()
        return Response({
            'success': True,
            'message': 'Splash screen deleted successfully'
        })


class ToggleSplashStatusView(APIView):
    """Toggle splash screen active status."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, splash_id):
        try:
            splash = Splash.objects.get(id=splash_id)
        except Splash.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Splash screen not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        splash.is_active = not splash.is_active
        splash.save()
        
        return Response({
            'success': True,
            'message': f'Splash screen {"activated" if splash.is_active else "deactivated"} successfully',
            'splash': SplashSerializer(splash).data
        })


class UpdateDisplayOrdersView(APIView):
    """Update display orders for multiple splash screens."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request):
        order_updates = request.data.get('orderUpdates', [])
        
        if not order_updates:
            return Response({
                'success': False,
                'error': 'orderUpdates must be a non-empty array'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for update in order_updates:
            if 'id' in update and 'displayOrder' in update:
                Splash.objects.filter(id=update['id']).update(
                    display_order=update['displayOrder']
                )
        
        return Response({
            'success': True,
            'message': 'Display orders updated successfully'
        })


class BulkUpdateStatusView(APIView):
    """Bulk update status for multiple splash screens."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request):
        ids = request.data.get('ids', [])
        is_active = request.data.get('isActive')
        
        if not ids:
            return Response({
                'success': False,
                'error': 'ids must be a non-empty array'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if is_active is None:
            return Response({
                'success': False,
                'error': 'isActive must be provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        Splash.objects.filter(id__in=ids).update(is_active=is_active)
        
        return Response({
            'success': True,
            'message': f'{len(ids)} splash screens {"activated" if is_active else "deactivated"} successfully'
        })


class SplashStatsView(APIView):
    """Get splash screen statistics."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        stats = Splash.objects.aggregate(
            total=Count('id'),
            active=Count('id', filter=Q(is_active=True)),
            inactive=Count('id', filter=Q(is_active=False)),
            scheduled=Count('id', filter=Q(start_date__isnull=False) | Q(end_date__isnull=False))
        )
        
        return Response({
            'success': True,
            'stats': stats
        })
