"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/files/', include('filestore.urls')),
    path('api/strategies/', include('strategies.urls')),
    path('api/training/', include('training.urls')),
    path('api/exclusive/', include('exclusive_content.urls')),
]

from core.custom_serve import serve_media_with_ranges

if settings.DEBUG:
    # Use custom view for media files to support seeking (Range requests)
    urlpatterns += [
        re_path(r'^local-repository/(?P<path>.*)$', serve_media_with_ranges),
    ]
    # Keep static helper for static files if needed, but MEDIA is handled above
    # urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
