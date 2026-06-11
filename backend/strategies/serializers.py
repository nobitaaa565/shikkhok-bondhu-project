from rest_framework import serializers
from .models import Strategy

class StrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = '__all__'
        read_only_fields = ('owner', 'date')
