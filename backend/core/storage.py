import os
from django.core.files.uploadedfile import UploadedFile
from cloudinary_storage.storage import MediaCloudinaryStorage, RESOURCE_TYPES

class AutoMediaCloudinaryStorage(MediaCloudinaryStorage):
    def _get_resource_type(self, name):
        if not name:
            return self.RESOURCE_TYPE
        ext = name.split('.')[-1].lower() if '.' in name else ''
        if ext in ['mp4', 'm4v', 'webm', 'ogv', 'avi', 'mov', 'mkv']:
            return RESOURCE_TYPES['VIDEO']
        elif ext in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']:
            return RESOURCE_TYPES['IMAGE']
        else:
            # PDFs, docx, txt, etc. are handled as raw files by Cloudinary
            return RESOURCE_TYPES['RAW']

    def _save(self, name, content):
        # Normalise name and prepend prefix
        name = self._normalise_name(name)
        name = self._prepend_prefix(name)
        content = UploadedFile(content, name)
        
        # Upload using the corrected resource type
        response = self._upload(name, content)
        public_id = response['public_id']
        
        # Keep the extension in the DB name so that subsequent URL lookups
        # can identify the correct resource type (e.g. video vs raw)
        ext = name.split('.')[-1].lower() if '.' in name else ''
        if ext and not public_id.lower().endswith('.' + ext):
            public_id = f"{public_id}.{ext}"
        return public_id

    def delete(self, name):
        resource_type = self._get_resource_type(name)
        
        # Cloudinary destroy API expects public_id without extension for images/videos
        if resource_type in [RESOURCE_TYPES['IMAGE'], RESOURCE_TYPES['VIDEO']]:
            ext = name.split('.')[-1].lower() if '.' in name else ''
            if ext:
                name = name[:-len(ext)-1]
                
        import cloudinary.uploader
        response = cloudinary.uploader.destroy(name, invalidate=True, resource_type=resource_type)
        return response.get('result') == 'ok'
