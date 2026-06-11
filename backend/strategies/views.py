from rest_framework import generics, permissions
from .models import Strategy
from .serializers import StrategySerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    All users can read.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class StrategyListCreateView(generics.ListCreateAPIView):
    queryset = Strategy.objects.all()
    serializer_class = StrategySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class StrategyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Strategy.objects.all()
    serializer_class = StrategySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
