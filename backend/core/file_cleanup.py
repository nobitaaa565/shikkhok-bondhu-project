import os
from django.db import models
from django.dispatch import receiver

def delete_physical_file(file_field):
    """Deletes file from storage/filesystem."""
    if file_field and file_field.name:
        try:
            # Delete using the storage backend (works for both Cloudinary and Local FS)
            file_field.storage.delete(file_field.name)
        except Exception:
            # Fallback to local os.remove if storage backend deletion fails
            try:
                path = file_field.path
                if path and os.path.isfile(path):
                    os.remove(path)
            except Exception:
                pass

def cleanup_on_delete(sender, instance, **kwargs):
    """Deletes physical files when a model instance is deleted."""
    for field in instance._meta.fields:
        if isinstance(field, models.FileField):
            file_field = getattr(instance, field.name)
            if file_field:
                delete_physical_file(file_field)

def cleanup_on_change(sender, instance, **kwargs):
    """Deletes old physical files when a FileField is updated."""
    if not instance.pk:
        return
    
    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    for field in instance._meta.fields:
        if isinstance(field, models.FileField):
            new_file = getattr(instance, field.name)
            old_file = getattr(old_instance, field.name)
            
            if old_file and new_file != old_file:
                delete_physical_file(old_file)
