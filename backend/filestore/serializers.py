from rest_framework import serializers
from .models import FileItem

class FileItemSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = FileItem
        fields = ['id', 'file', 'category', 'is_public', 'title', 'description', 'file_type', 'grade', 'subject', 'uploaded_at', 'owner', 'owner_username']
