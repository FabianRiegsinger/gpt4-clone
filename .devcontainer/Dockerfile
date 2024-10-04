# This docker image defines the container for the CI/CD pipeline
# Ubuntu 22.04
FROM ubuntu:jammy

ARG DEBIAN_FRONTEND=noninteractive

# Probably fixes issues related to downloading electron via npm
ENV ELECTRON_GET_USE_PROXY=1

# Update the package lists for upgrades and new package installations
RUN apt-get update \
    && apt-get install -y python3 \
    && apt-get install -y python3-pip \
    && apt-get install -y git \
    && apt-get install -y curl \
    && apt-get install -y gnupg \
    && apt-get install -y libdbus-1-3 \
    && apt-get install -y libatk1.0-0 \
    && apt-get install -y libatk-bridge2.0-0 \
    && apt-get install -y libcups2 \
    && apt-get install -y libgtk-3-0 \
    && apt-get install -y libgbm1 \
    && apt-get install -y libasound2 \
    && apt-get install -y libnss3 \
    && apt-get install -y dbus \
    && apt-get install -y dbus-x11 \
    && apt-get install -y x11vnc \
    && apt-get install -y xvfb \
    && apt-get clean

RUN rm -rf /var/lib/apt/lists/*

# Start the D-Bus service
RUN service dbus start

# Add NodeSource APT repository for Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m nonroot

# Switch to the non-root user
USER nonroot

# Create directory and set as entry point when connecting to container
WORKDIR /workspace

# Copy folders to workspace
COPY ["backend", "./backend"]
COPY ["electron-react-frontend", "./electron-react-frontend"]

# Install python dependencies to get the django backend running
RUN python3 -m pip install -r backend/requirements.txt
#RUN python3 backend/manage.py runserver &
#CMD ["bash", "-c", "python3 backend/manage.py runserver&"]

WORKDIR /workspace/electron-react-frontend

RUN npm install

USER root

# Start the VNC server
# Start the VNC server and your application
#CMD ["sh", "-c", "Xvfb :0 -screen 0 1024x768x16 & x11vnc -display :0"]