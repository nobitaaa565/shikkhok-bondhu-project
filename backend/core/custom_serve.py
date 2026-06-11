
import os
import re
import mimetypes
from django.http import StreamingHttpResponse, HttpResponse, Http404
from django.conf import settings

def iterator(file_path, start, length, chunk_size=8192):
    with open(file_path, "rb") as f:
        f.seek(start)
        remaining = length
        while remaining > 0:
            read_length = min(chunk_size, remaining)
            data = f.read(read_length)
            if not data:
                break
            remaining -= len(data)
            yield data

def serve_media_with_ranges(request, path):
    """
    Custom view to serve media files with robust HTTP Range support.
    Essential for video seeking in browsers.
    """
    # Sanitize and construct path
    path = path.lstrip('/')
    full_path = os.path.join(settings.MEDIA_ROOT, path)
    
    # Ensure we don't escape MEDIA_ROOT
    try:
        full_path = os.path.abspath(full_path)
        if not full_path.startswith(os.path.abspath(settings.MEDIA_ROOT)):
            raise Http404("Access denied")
    except Exception:
        raise Http404("Invalid path")

    if not os.path.exists(full_path):
        raise Http404(f"File not found: {path}")

    stat_obj = os.stat(full_path)
    file_size = stat_obj.st_size
    
    content_type, encoding = mimetypes.guess_type(full_path)
    content_type = content_type or 'application/octet-stream'

    range_header = request.META.get('HTTP_RANGE', '').strip()
    
    if range_header:
        range_match = re.search(r'bytes=(\d+)-(\d*)', range_header)
        if range_match:
            try:
                start = int(range_match.group(1))
                end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
            except ValueError:
                return HttpResponse(status=416) # Range Not Satisfiable
            
            if start >= file_size:
                return HttpResponse(status=416)
                
            if end >= file_size:
                end = file_size - 1
                
            if start > end:
                return HttpResponse(status=416)

            length = end - start + 1
            
            response = StreamingHttpResponse(
                iterator(full_path, start, length),
                status=206,
                content_type=content_type
            )
            response['Content-Length'] = str(length)
            response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
            response['Accept-Ranges'] = 'bytes'
            return response

    # Full content response
    response = StreamingHttpResponse(
        iterator(full_path, 0, file_size),
        content_type=content_type
    )
    response['Content-Length'] = str(file_size)
    response['Accept-Ranges'] = 'bytes'
    return response
