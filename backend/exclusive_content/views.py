
from rest_framework import generics, permissions
from .models import ExclusiveMaterial
from .serializers import ExclusiveMaterialSerializer
from strategies.views import IsAdminOrReadOnly

class ExclusiveMaterialListCreateView(generics.ListCreateAPIView):
    queryset = ExclusiveMaterial.objects.all()
    serializer_class = ExclusiveMaterialSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

class ExclusiveMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExclusiveMaterial.objects.all()
    serializer_class = ExclusiveMaterialSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
