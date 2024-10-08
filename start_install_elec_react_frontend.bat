@echo off

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js is installed
    :: You can also print the Node.js version
    node --version
) else (
    echo Node.js is not installed
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo npm is installed
    :: You can also print the npm version
    ::npm --version
) else (
    echo npm is not installed
)

:: Check if the folder exists
if exist "%~dp0/electron-react-frontend/node_modules" (
    echo Project dependencies seem to be installed..
    echo Starting application...
    npm run dev --prefix "%~dp0electron-react-frontend/"
) else (
    echo node_modules does not exist...
    echo Executing npm install to install project dependencies...
    :: Execute the command
    cd /d "%~dp0electron-react-frontend
    npm install .

    echo Starting application...
    npm run dev
)
