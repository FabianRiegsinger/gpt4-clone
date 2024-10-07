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
export GPT4o_API_KEY=
export GPT4o_DEPLOYMENT_ENDPOINT=

# Step 3: Starting the django backend
echo "Starting Python script..."
python backend/manage.py runserver
