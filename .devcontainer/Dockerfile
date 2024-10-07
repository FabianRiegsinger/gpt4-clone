# Stage 1: Build the React Electron frontend
FROM node:18-alpine as frontend

WORKDIR /app/electron-react-frontend

# Install dependencies
COPY electron-react-frontend/package.json electron-react-frontend/package-lock.json ./
RUN npm install

# Copy the rest of the frontend files and build the Electron app
COPY electron-react-frontend/ ./
RUN npm run dev

# TODO: Start graphical application from docker.

# Stage 2: Set up Django backend
FROM python:3.12 as backend

WORKDIR /app/backend

# Install Python dependencies
COPY backend/requirements.txt ./
RUN python3 -m pip install -r requirements.txt

# Copy the rest of the Django backend files
COPY backend/ ./

# Expose the port the backend will run on
EXPOSE 8000

# Command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]