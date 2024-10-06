#!/bin/bash

# Install python dependencies if not happend already requirements.txt
echo "Installing Python dependencies..."
python3 -m pip install -r backend/requirements.txt

#Set environment variables
echo "Setting environment variables..."
export GPT4o_API_KEY=
export GPT4o_DEPLOYMENT_ENDPOINT=

# Step 3: Starting the django backend
echo "Starting Python script..."
python backend/manage.py runserver
