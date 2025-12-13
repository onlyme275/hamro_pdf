"""
URL patterns for Signatures app.
"""

from django.urls import path
from .views import (
    SignatureListCreateView,
    SignatureDetailView,
    DefaultSignatureView,
    SetDefaultSignatureView,
    UserSignatureUploadView,
    UserSignatureListView,
    UserSignatureDetailView,
    UserSignatureViewView,
)

app_name = 'signatures'

urlpatterns = [
    # Digital signatures (base64)
    path('', SignatureListCreateView.as_view(), name='list_create'),
    path('default/', DefaultSignatureView.as_view(), name='default'),
    path('<int:signature_id>/', SignatureDetailView.as_view(), name='detail'),
    path('<int:signature_id>/set-default/', SetDefaultSignatureView.as_view(), name='set_default'),
    
    # Signature image files
    path('upload/', UserSignatureUploadView.as_view(), name='upload'),
    path('user/<int:user_id>/', UserSignatureListView.as_view(), name='user_list'),
    path('view/<int:signature_id>/', UserSignatureViewView.as_view(), name='view'),
    path('file/<int:signature_id>/', UserSignatureDetailView.as_view(), name='file_detail'),
]