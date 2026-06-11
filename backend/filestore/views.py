from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from .models import FileItem
from .serializers import FileItemSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsPublicOrOwner
from django.db.models import Q

class FileUploadView(generics.CreateAPIView):
    queryset = FileItem.objects.all()
    serializer_class = FileItemSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class FileListView(generics.ListAPIView):
    serializer_class = FileItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = FileItem.objects.filter(Q(owner=user) | Q(is_public=True))
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class FileDetailView(generics.RetrieveAPIView):
    queryset = FileItem.objects.all()
    serializer_class = FileItemSerializer
    permission_classes = [IsAuthenticated, IsPublicOrOwner]
