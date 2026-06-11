
from rest_framework import serializers
from .models import ExclusiveMaterial

class ExclusiveMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExclusiveMaterial
        fields = '__all__'
