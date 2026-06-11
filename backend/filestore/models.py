from django.db import models
from django.conf import settings
from django.db.models.signals import pre_save, post_delete
from core.file_cleanup import cleanup_on_change, cleanup_on_delete

class FileItem(models.Model):
    CATEGORY_CHOICES = [
        ('training', 'Training'),
        ('exclusive', 'Exclusive'),
        ('strategy', 'Strategy'),
        ('community', 'Community'),
        ('other', 'Other'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files', null=True, blank=True)
    file = models.FileField(upload_to='uploads/')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    is_public = models.BooleanField(default=False)
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    file_type = models.CharField(max_length=50, blank=True)
    grade = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=50, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File {self.id}: {self.file.name} ({self.category}, Public: {self.is_public}) (Owner: {self.owner})"

class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    file_item = models.ForeignKey(FileItem, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'file_item')

    def __str__(self):
        return f"Bookmark: {self.user.username} - {self.file_item.title}"

pre_save.connect(cleanup_on_change, sender=FileItem)
post_delete.connect(cleanup_on_delete, sender=FileItem)
