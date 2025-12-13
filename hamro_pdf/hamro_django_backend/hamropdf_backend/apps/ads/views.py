"""
Views for Ads app.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q, F

from .models import Ad, AdImpression, AdClick
from .serializers import AdSerializer, AdPublicSerializer, AdCreateSerializer
from apps.users.permissions import IsAdmin


def get_client_ip(request):
    """Get client IP from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


class AdListCreateView(APIView):
    """List all ads or create new ad (admin only)."""
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated(), IsAdmin()]

    def get(self, request):
        """Get all ads with optional filters."""
        queryset = Ad.objects.all()
        
        placement = request.query_params.get('placement')
        is_active = request.query_params.get('isActive')
        
        if placement:
            queryset = queryset.filter(placement=placement)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return Response({
            'success': True,
            'ads': AdSerializer(queryset, many=True).data
        })

    def post(self, request):
        """Create new ad."""
        serializer = AdCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            ad = serializer.save(created_by=request.user)
            return Response({
                'success': True,
                'ad': AdSerializer(ad).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Failed to create ad',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class AdDetailView(APIView):
    """Get, update, or delete a specific ad."""
    permission_classes = [IsAuthenticated, IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, ad_id):
        try:
            return Ad.objects.get(id=ad_id)
        except Ad.DoesNotExist:
            return None

    def get(self, request, ad_id):
        ad = self.get_object(ad_id)
        if not ad:
            return Response({
                'success': False,
                'message': 'Ad not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'ad': AdSerializer(ad).data
        })

    def put(self, request, ad_id):
        ad = self.get_object(ad_id)
        if not ad:
            return Response({
                'success': False,
                'message': 'Ad not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AdCreateSerializer(ad, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'ad': AdSerializer(ad).data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, ad_id):
        ad = self.get_object(ad_id)
        if not ad:
            return Response({
                'success': False,
                'message': 'Ad not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        ad.delete()
        return Response({
            'success': True,
            'message': 'Ad deleted successfully'
        })


class ActiveAdByPlacementView(APIView):
    """Get active ad by placement (public)."""
    permission_classes = [AllowAny]

    def get(self, request, placement):
        now = timezone.now()
        
        ad = Ad.objects.filter(
            placement=placement,
            is_active=True
        ).filter(
            Q(start_date__isnull=True) | Q(start_date__lte=now)
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=now)
        ).order_by('?').first()
        
        if not ad:
            return Response({
                'success': False,
                'message': 'No active ad found for this placement'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'ad': AdPublicSerializer(ad).data
        })


class TrackImpressionView(APIView):
    """Track ad impression."""
    permission_classes = [AllowAny]

    def post(self, request, ad_id):
        try:
            ad = Ad.objects.get(id=ad_id)
        except Ad.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Ad not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Create impression log
        AdImpression.objects.create(
            ad=ad,
            user=request.user if request.user.is_authenticated else None,
            ip_address=get_client_ip(request)
        )
        
        # Increment counter
        Ad.objects.filter(id=ad_id).update(impressions=F('impressions') + 1)
        
        return Response({'success': True})


class TrackClickView(APIView):
    """Track ad click."""
    permission_classes = [AllowAny]

    def post(self, request, ad_id):
        try:
            ad = Ad.objects.get(id=ad_id)
        except Ad.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Ad not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Create click log
        AdClick.objects.create(
            ad=ad,
            user=request.user if request.user.is_authenticated else None,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        )
        
        # Increment counter
        Ad.objects.filter(id=ad_id).update(clicks=F('clicks') + 1)
        
        return Response({'success': True})


class AdStatsView(APIView):
    """Get ad statistics."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, ad_id):
        try:
            ad = Ad.objects.get(id=ad_id)
        except Ad.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Ad not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'stats': {
                'impressions': ad.impressions,
                'clicks': ad.clicks,
                'ctr': ad.ctr
            }
        })
