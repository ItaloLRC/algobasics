from rest_framework import serializers
from .models import Article, Tag, Upvote

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class ArticleSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    upvote_count = serializers.IntegerField(source='upvotes.count', read_only=True)

    class Meta:
        model = Article
        fields = '__all__'