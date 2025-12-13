"""
URL patterns for Ads app.
"""

from django.urls import path
from .views import (
    AdListCreateView,
    AdDetailView,
    ActiveAdByPlacementView,
    TrackImpressionView,
    TrackClickView,
    AdStatsView,
)

app_name = 'ads'

urlpatterns = [
    # Public routes
    path('placement/<str:placement>/', ActiveAdByPlacementView.as_view(), name='active_by_placement'),
    path('<uuid:ad_id>/impression/', TrackImpressionView.as_view(), name='track_impression'),
    path('<uuid:ad_id>/click/', TrackClickView.as_view(), name='track_click'),
    
    # Admin routes
    path('', AdListCreateView.as_view(), name='list_create'),
    path('<uuid:ad_id>/', AdDetailView.as_view(), name='detail'),
    path('<uuid:ad_id>/stats/', AdStatsView.as_view(), name='stats'),
]
