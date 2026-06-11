from django.db import models
from django.db.models.signals import pre_save, post_delete
from core.file_cleanup import cleanup_on_change, cleanup_on_delete

class ExclusiveMaterial(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True, null=True)
    subject = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=50, default='pdf')
    status = models.CharField(max_length=50, default='active')
    description = models.TextField(blank=True, null=True)
    directions = models.TextField(blank=True, null=True)
    extraLinks = models.TextField(blank=True, null=True, help_text="Comma separated URLs")
    bookCover = models.CharField(max_length=100, blank=True, null=True)
    unit = models.CharField(max_length=100, blank=True, null=True)
    lesson = models.CharField(max_length=100, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    file = models.FileField(upload_to='exclusive_materials/', blank=True, null=True)
    videoUrl = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    views = models.IntegerField(default=0)

    def __str__(self):
        return self.title

pre_save.connect(cleanup_on_change, sender=ExclusiveMaterial)
post_delete.connect(cleanup_on_delete, sender=ExclusiveMaterial)
