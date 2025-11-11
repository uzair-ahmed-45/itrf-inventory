@echo off
echo ================================================
echo Inventory ITRF - Build Script
echo ================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Building application for production...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ================================================
    echo BUILD FAILED!
    echo ================================================
    pause
    exit /b %errorlevel%
)

echo.
echo ================================================
echo BUILD SUCCESSFUL!
echo ================================================
echo.
echo Build output location: dist\
echo.
echo NEXT STEPS:
echo 1. Navigate to dist folder
echo 2. Edit config.js and update API_URL to your server URL
echo 3. Copy entire dist folder to your IIS server
echo 4. Follow the DEPLOYMENT.md guide for IIS setup
echo.
echo ================================================
pause

