#!/bin/bash

# Check if the folder exists
if [ -d "electron-react-frontend/node_modules" ]; then
    echo "Project dependencies seem to be installed.."
    echo "Starting application..."
    npm run dev --prefix ./electron-react-frontend
else
    echo "node_modules does not exist..."
    echo "Executing npm install to install project dependencies..."
    # Execute the command
    npm install --prefix ./electron-react-frontend

    echo "Starting application..."
    npm run dev --prefix ./electron-react-frontend
fi
