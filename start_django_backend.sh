#!/bin/bash

# Install python dependencies if not happend already requirements.txt
echo "Installing Python dependencies..."
python3 -m pip install -r backend/requirements.txt

#Set environment variables
echo "Setting environment variables..."
export GPT4o_API_KEY=59334c6e31874e0393482b4e669dc3f3
export GPT4o_DEPLOYMENT_ENDPOINT=https://zdp-x-cc-sdc-oai.openai.azure.com/

# Step 3: Starting the django backend
echo "Starting Python script..."
python backend/manage.py runserver
