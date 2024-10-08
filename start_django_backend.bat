@echo off

:: Check if python3 is installed
where python3 >nul 2>nul
if %errorlevel% equ 0 (
    echo Python 3 is installed!
    :: Optionally, print the version
    python --version
) else (
    echo Python 3 is not installed.
    exit /b 1
)

:: Install python dependencies if not happened already
echo Installing Python dependencies from requirements.txt...
python -m pip install -r backend\requirements.txt

:: Set environment variables
echo Setting environment variables...
set GPT4o_API_KEY=
set GPT4o_DEPLOYMENT_ENDPOINT=

:: Start the Django backend
echo Starting Python script...
python backend\manage.py runserver
