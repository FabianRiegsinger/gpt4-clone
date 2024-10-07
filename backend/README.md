# Readme for the Django backend

```
NOTE: For this application to work an AzureOpenAI endpoint and an API key needs to be pasted at the right spot.

This can be done by exporting both as environmental variables or using the script `start_django_backend.sh`
```

This is the Django backend of this Gpt4o clone. It connects the electron react frontend via REST API calls to share the users inputs with the OpenAI API and present them via the same communction channel to the frontend.

As described in the main README.md file at the top level of this repository the backend may be started automatically via Docker, or manually. The manual steps required to start the backend will be described in the following section.

## Manual Startup of the Backend

Requirements: python 3.12 (Has been tested. May also work with slightly older versions)

1. Install project specific dependencies via pip. Open a terminal and navigate to the backend folder and execute: `python -m pip install -r requirements.txt`.
3. Execute `python manage.py runserver` to start the django backend

The console output shoudl be similar to the following output:

```
python manage.py runserver
--------------------------

Watching for file changes with StatReloader
Performing system checks...

INFO: Initializing gpt-4o CLONE...
System check identified no issues (0 silenced).
October 04, 2024 - 13:28:18
Django version 5.1.1, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```