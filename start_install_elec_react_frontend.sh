#!/bin/bash

# Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
    echo "Node.js is installed"
    # You can also print the Node.js version
    node --version
else
    echo "Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if command -v npm >/dev/null 2>&1; then
    echo "npm is installed"
    # You can also print the npm version
    npm --version
else
    echo "npm is not installed"
    exit 1
fi

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
