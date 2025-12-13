"""
URL configuration for hamropdf project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API routes
    path('api/user/', include('apps.users.urls')),
    path('api/files/', include('apps.files.urls')),
    path('api/user-signatures/', include('apps.signatures.urls')),
    path('api/ads/', include('apps.ads.urls')),
    path('api/splash/', include('apps.splash.urls')),
    path('api/pdf/', include('apps.pdf_tools.urls')),
    
    # Social auth
    path('auth/', include('social_django.urls', namespace='social')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
