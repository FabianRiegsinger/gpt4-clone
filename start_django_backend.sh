#!/bin/bash

# Check if python3 is installed
if command -v python3 &>/dev/null; then
    echo "Python 3 is installed!"
    # Optionally, print the version
    python3 --version
else
    echo "Python 3 is not installed."
    exit 1
fi

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
