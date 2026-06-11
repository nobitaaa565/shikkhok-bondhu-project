import re

dashboard_path = '/Users/nobita/works/capstone project/frontend/pages/Dashboard.tsx'
educore_path = '/Users/nobita/works/capstone project/frontend/pages/EducoreContents.tsx'

with open(dashboard_path, 'r') as f:
    dashboard_content = f.read()

# Extract from '<div className="w-full">' right before 'Interactive Library'
# up to the end of the 'Interactive Simulations' section container.

# We will find the exact bounds:
# start index: the first <div className="w-full"> that contains "Interactive Library"
# It actually starts at line 119 in the modified file view block.
match = re.search(r'      <div className="w-full">[^<]*<div className="flex items-center justify-between mb-6">[^<]*<div className="flex items-center gap-4">[^<]*<div className="w-2.5 h-8 bg-\[#7c3aed\] rounded-full"></div>[^<]*<h2 className="text-2xl font-black uppercase tracking-tighter text-white \[html\[data-theme=\'light\'\]_&\]:text-\[#0F172A\]">\s*Interactive Library.*?interactive simulations section.*?</div>\n      </div>\n', dashboard_content, re.DOTALL | re.IGNORECASE)

# Or safer, we can just split dashboard_content at line 119 and line 406.
with open(dashboard_path, 'r') as f:
    lines = f.readlines()

# find exact line for "Interactive Library"
start_index = -1
for i, line in enumerate(lines):
    if "Interactive Library" in line:
        start_index = i - 4
        break

# find the end of "Interactive Simulations Section"
# It ends right before "Recent Uploads Section" which has <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
end_index = -1
for i, line in enumerate(lines):
    if "Recent Uploads Section" in line:
        end_index = i - 2
        break

if start_index != -1 and end_index != -1:
    extracted_content = "".join(lines[start_index:end_index])
    # Remove it from dashboard
    new_dashboard_content = "".join(lines[:start_index]) + "".join(lines[end_index:])
    with open(dashboard_path, 'w') as f:
        f.write(new_dashboard_content)

    # Now insert into EducoreContents.tsx
    with open(educore_path, 'r') as f:
        educore_content = f.read()
    
    # insert Link import if not there
    if "import { Link" not in educore_content and "import { Link }" not in educore_content:
        educore_content = educore_content.replace(
            "import { useLocation, useNavigate } from 'react-router-dom';",
            "import { useLocation, useNavigate, Link } from 'react-router-dom';"
        )
    
    # insert at the end of EducoreContents (before `<div className="p-32 text-center`? No, after `</div>` of the map)
    # Actually, right before `      </div>\n      <style>{`
    insert_point_search = "      </div>\n      <style>{`\n"
    if insert_point_search in educore_content:
        new_educore_content = educore_content.replace(
            insert_point_search,
            extracted_content + "\n" + insert_point_search
        )
        with open(educore_path, 'w') as f:
            f.write(new_educore_content)
        print("Success!")
    else:
        print("Could not find insert point in EducoreContents.")
else:
    print(f"Could not find start or end indices. Start: {start_index}, End: {end_index}")
