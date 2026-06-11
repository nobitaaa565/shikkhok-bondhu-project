#!/bin/bash
# Activate virtual environment
source venv/bin/activate

# Migrate database first
python manage.py migrate

# Run the Django server
python manage.py runserver
