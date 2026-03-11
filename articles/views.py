from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Article, Tag, Upvote
from .serializers import ArticleSerializer, TagSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    if not username or not password:
        return Response({'error': 'Username e senha obrigatórios.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username já existe.'}, status=400)
    if len(password) < 6:
        return Response({'error': 'Senha deve ter ao menos 6 caracteres.'}, status=400)
    user = User.objects.create_user(username=username, password=password)
    login(request, user)
    return Response({'id': user.id, 'username': user.username})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({'error': 'Credenciais inválidas.'}, status=401)
    login(request, user)
    return Response({'id': user.id, 'username': user.username})


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'ok': True})


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie 
def me_view(request):
    if request.user.is_authenticated:
        return Response({'id': request.user.id, 'username': request.user.username})
    return Response({'user': None})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upvote_view(request, slug):
    article = Article.objects.get(slug=slug)
    upvote, created = Upvote.objects.get_or_create(article=article, user=request.user)
    if not created:
        upvote.delete()
        voted = False
    else:
        voted = True
    return Response({'upvote_count': article.upvotes.count(), 'voted': voted})


@api_view(['GET'])
@permission_classes([AllowAny])
def upvote_status_view(request, slug):
    article = Article.objects.get(slug=slug)
    voted = request.user.is_authenticated and Upvote.objects.filter(article=article, user=request.user).exists()
    return Response({'upvote_count': article.upvotes.count(), 'voted': voted})


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Article.objects.filter(published=True).prefetch_related('tags', 'upvotes')
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__slug=tag)
        return qs