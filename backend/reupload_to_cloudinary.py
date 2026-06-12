import os
import sys
import django
from pathlib import Path
from django.core.files.base import ContentFile

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from filestore.models import FileItem
from exclusive_content.models import ExclusiveMaterial
from django.conf import settings

def find_local_file(db_filename, media_dir):
    if not db_filename:
        return None
    filename = os.path.basename(db_filename)
    
    # 1. Direct path check
    direct_path = media_dir / filename
    if direct_path.exists():
        return direct_path
        
    # 2. Check by stripping suffix (e.g. debate_xek0si -> debate.png)
    base_name = os.path.splitext(filename)[0]
    
    # Special fallback for tool-1 (since tool-1-new.m4v was deleted)
    if "tool-1" in base_name.lower():
        pdf_path = media_dir / "tool-1.pdf"
        if pdf_path.exists():
            return pdf_path
            
    # Try prefix matching for base_name split by last underscore
    parts = base_name.rsplit('_', 1)
    if len(parts) > 1:
        prefix = parts[0]
        matches = list(media_dir.glob(f"{prefix}*"))
        if matches:
            return matches[0]
            
    # Try splitting by first underscore
    prefix2 = base_name.split('_')[0]
    matches = list(media_dir.glob(f"{prefix2}*"))
    if matches:
        return matches[0]
        
    # Check if a file contains the base name or vice versa
    for f in media_dir.iterdir():
        if f.is_file():
            f_base = os.path.splitext(f.name)[0]
            if base_name in f_base or f_base in base_name:
                return f
                
    return None

def main():
    if not getattr(settings, 'DEFAULT_FILE_STORAGE', '').endswith('AutoMediaCloudinaryStorage'):
        print("ERROR: AutoMediaCloudinaryStorage is not active in settings.py.")
        print("Please make sure CLOUDINARY_URL is set in your environment and settings.py is updated.")
        return

    local_media_dir = BASE_DIR / 'LOCAL_CONTENT_REPOSITORY' / 'uploads'
    if not local_media_dir.exists():
        print(f"ERROR: Local media directory not found at {local_media_dir}")
        return

    items = FileItem.objects.all()
    print(f"Found {items.count()} total database file items to check.")

    file_mapping = {} # Maps original db filename to new Cloudinary URL

    for item in items:
        if not item.file:
            continue

        local_file = find_local_file(item.file.name, local_media_dir)
        if not local_file:
            print(f"File {item.id} ({item.file.name}) -> Local file not found in uploads folder. Skipping.")
            continue

        filename = local_file.name
        ext = os.path.splitext(filename)[1].lower()

        # Skip dummy text files (except training_doc.txt and test_upload.txt which are referenced)
        if ext in ['.txt'] and filename not in ['training_doc.txt', 'test_upload.txt']:
            print(f"File {item.id} ({filename}) -> Skipping dummy text file.")
            continue

        try:
            print(f"Uploading {filename} to Cloudinary...")
            with open(local_file, 'rb') as f:
                file_content = f.read()

            # Save the file (this triggers AutoMediaCloudinaryStorage to upload it)
            item.file.save(filename, ContentFile(file_content))
            item.save()
            
            # Save the generated URL to our mapping
            new_url = item.file.url
            file_mapping[filename] = new_url
            print(f"--> Successfully uploaded and saved: {new_url}")

        except Exception as e:
            print(f"Failed to upload File {item.id} ({filename}): {e}")

    # Now fix the hardcoded URLs in ExclusiveMaterial models
    print("\nUpdating ExclusiveMaterial hardcoded URLs...")
    materials = ExclusiveMaterial.objects.all()
    fixed_count = 0
    for material in materials:
        url = material.videoUrl
        if url:
            filename = os.path.basename(url)
            # Find in our mapping
            matched_url = None
            for orig_name, new_url in file_mapping.items():
                orig_base, _ = os.path.splitext(orig_name)
                file_base, _ = os.path.splitext(filename)
                if orig_base in file_base or file_base in orig_base:
                    matched_url = new_url
                    break
            
            if matched_url:
                print(f"Updating '{material.title}' videoUrl -> {matched_url}")
                material.videoUrl = matched_url
                material.save()
                fixed_count += 1
            else:
                # If it's a relative/local URL but we couldn't match it, warn the user
                if 'http' not in url:
                    print(f"WARNING: No matching uploaded file found for local URL '{url}' in '{material.title}'")

    print(f"\nFinished! Updated {fixed_count} ExclusiveMaterial references.")

if __name__ == '__main__':
    main()
