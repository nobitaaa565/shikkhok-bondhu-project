import re

dashboard_path = '/Users/nobita/works/capstone project/frontend/pages/Dashboard.tsx'

with open(dashboard_path, 'r') as f:
    content = f.read()

# Replace the Recent Uploads array
old_array_start = "  const recentUploads = ["
old_array_end_str = "  ];"

start = content.find(old_array_start)
if start != -1:
    end = content.find(old_array_end_str, start) + len(old_array_end_str)
    
    new_array = """  const recentUploads = [
    {
      title: 'Fractions Basics',
      type: 'Presentation',
      date: 'Oct 24, 2024',
      status: 'Published',
      stats: { views: 245, downloads: 12 }
    },
    {
      title: 'Multiplication Tables',
      type: 'Worksheet',
      date: 'Scheduled: Oct 28',
      status: 'Scheduled',
      remaining: '2d 4h',
      stats: { views: 0, downloads: 0 }
    },
    {
      title: 'Addition & Subtraction',
      type: 'Quiz',
      date: 'Oct 20, 2024',
      status: 'Published',
      stats: { views: 890, downloads: 45 }
    },
  ];"""
    
    content = content[:start] + new_array + content[end:]
    
    with open(dashboard_path, 'w') as f:
        f.write(content)
    print("Updated Dashboard!")
