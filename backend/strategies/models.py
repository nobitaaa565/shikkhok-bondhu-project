from django.db import models
from django.conf import settings

class Strategy(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True, null=True)
    subject = models.CharField(max_length=100, blank=True, null=True)
    bookCover = models.CharField(max_length=100, blank=True, null=True) # Tailwind class like 'bg-rose-900'
    readTime = models.CharField(max_length=50, blank=True, null=True)
    unit = models.CharField(max_length=100, blank=True, null=True)
    lesson = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=50, default='strategy')
    status = models.CharField(max_length=50, default='active')
    description = models.TextField(blank=True, null=True)
    directions = models.TextField(blank=True, null=True)
    videoUrl = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='strategies')

    def __str__(self):
        return self.title
