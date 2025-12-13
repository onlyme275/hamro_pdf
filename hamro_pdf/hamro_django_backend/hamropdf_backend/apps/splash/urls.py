"""
URL patterns for Splash app.
"""

from django.urls import path
from .views import (
    ActiveSplashView,
    SplashListCreateView,
    SplashDetailView,
    ToggleSplashStatusView,
    UpdateDisplayOrdersView,
    BulkUpdateStatusView,
    SplashStatsView,
)

app_name = 'splash'

urlpatterns = [
    # Public routes
    path('active/', ActiveSplashView.as_view(), name='active'),
    
    # Admin routes
    path('admin/stats/', SplashStatsView.as_view(), name='stats'),
    path('update-orders/', UpdateDisplayOrdersView.as_view(), name='update_orders'),
    path('bulk-status/', BulkUpdateStatusView.as_view(), name='bulk_status'),
    path('', SplashListCreateView.as_view(), name='list_create'),
    path('<uuid:splash_id>/toggle-status/', ToggleSplashStatusView.as_view(), name='toggle_status'),
    path('<uuid:splash_id>/', SplashDetailView.as_view(), name='detail'),
]