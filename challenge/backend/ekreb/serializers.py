from rest_framework import serializers
from .models import *

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word']

class StatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = ['score', 'accuracy']
