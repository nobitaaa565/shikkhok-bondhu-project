
from django.urls import path
from .views import ExclusiveMaterialListCreateView, ExclusiveMaterialDetailView

urlpatterns = [
    path('materials/', ExclusiveMaterialListCreateView.as_view(), name='material-list'),
    path('materials/<int:pk>/', ExclusiveMaterialDetailView.as_view(), name='material-detail'),
]
