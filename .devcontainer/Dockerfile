# Stage 1: Build the React Electron frontend
#FROM node:18-alpine as frontend
FROM mcr.microsoft.com/devcontainers/base:jammy

# Set environment variables to avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package lists for upgrades and new package installations
RUN apt-get update \
    && apt-get install -y git \
    && apt-get install -y curl \
    && apt-get install -y gnupg \
    && apt-get install -y python3 \
    && apt-get install -y python3-pip \
    && apt-get install -y libdbus-1-3 \
    && apt-get install -y libatk1.0-0 \
    && apt-get install -y libatk-bridge2.0-0 \
    && apt-get install -y libcups2 \
    && apt-get install -y libgtk-3-0 \
    && apt-get install -y libgbm1 \
    && apt-get install -y libasound2 \
    && apt-get install -y libnss3 \
    && apt-get install -y xvfb \
    && apt-get clean
RUN rm -rf /var/lib/apt/lists/*

#RUN service dbus start

# Add NodeSource APT repository for Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/electron-react-frontend

# Install dependencies
#COPY electron-react-frontend/package.json electron-react-frontend/package-lock.json ./
COPY electron-react-frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend files and build the Electron app
COPY electron-react-frontend/ ./

EXPOSE 5173
#RUN npm run dev

# TODO: Start graphical application from docker.

# Stage 2: Set up Django backend
#FROM python:3.12 as backend

WORKDIR /app/backend

# Install Python dependencies
COPY backend/requirements.txt ./
RUN python3 -m pip install -r requirements.txt

# Copy the rest of the Django backend files
COPY backend/ ./

# Expose the port the backend will run on
EXPOSE 8000

# Command to run the Django development server
RUN python3 backend/manage.py runserver &
#CMD ["python3", "manage.py", "runserver"]
#CMD ["bash", "-c", "python3 manage.py runserver &"]