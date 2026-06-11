from django.db import models
from django.db.models.signals import pre_save, post_delete
from core.file_cleanup import cleanup_on_change, cleanup_on_delete

class Course(models.Model):
    title = models.CharField(max_length=255)
    instructor = models.CharField(max_length=255)
    duration = models.CharField(max_length=50)
    enrolled = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    level = models.CharField(max_length=50, default='Beginner')
    image = models.TextField(blank=True, help_text="Image URL or character class")
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='')
    video_url = models.TextField(blank=True, null=True, help_text="Embed URL or script")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.module.title} - {self.title}"

class LessonResource(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='resources', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50) # pdf, image, etc.
    file = models.FileField(upload_to='training_resources/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

pre_save.connect(cleanup_on_change, sender=LessonResource)
post_delete.connect(cleanup_on_delete, sender=LessonResource)
