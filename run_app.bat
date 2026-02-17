@echo off
REM Change directory to the script's directory (absolute path)
cd /d "%~dp0"

echo ==========================================
echo Setting up Resume Matcher Environment...
echo ==========================================

REM Install dependencies
echo Installing requirements...
pip install -r requirements.txt

REM Check for errors
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to install dependencies. Please check your internet connection or python installation.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==========================================
echo Starting Application...
echo ==========================================
echo Server will start at http://localhost:5000
echo.

REM Run the app
python app.py

pause
