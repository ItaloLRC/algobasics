from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, TagViewSet, login_view, logout_view, register_view, me_view, upvote_view, upvote_status_view

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),
    path('auth/register/', register_view),
    path('auth/me/', me_view),
    path('articles/<slug:slug>/upvote/', upvote_view),
    path('articles/<slug:slug>/upvote/status/', upvote_status_view),
]