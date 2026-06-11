from django.urls import path
from .views import StrategyListCreateView, StrategyDetailView

urlpatterns = [
    path('', StrategyListCreateView.as_view(), name='strategy-list-create'),
    path('<int:pk>/', StrategyDetailView.as_view(), name='strategy-detail'),
]
