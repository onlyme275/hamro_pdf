"""
URL patterns for Files app.
"""

from django.urls import path
from .views import (
    FileUploadView,
    UserFilesView,
    FileDetailView,
    FileDownloadView,
    FileViewView,
)

app_name = 'files'

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='upload'),
    path('user/<int:user_id>/', UserFilesView.as_view(), name='user_files'),
    path('download/<uuid:file_id>/', FileDownloadView.as_view(), name='download'),
    path('view/<uuid:file_id>/', FileViewView.as_view(), name='view'),
    path('<uuid:file_id>/', FileDetailView.as_view(), name='detail'),
]
