from django.urls import path
from .views import FileUploadView, FileListView, FileDetailView

urlpatterns = [
    path('', FileListView.as_view(), name='file-list'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('<int:pk>/', FileDetailView.as_view(), name='file-detail'),
]
