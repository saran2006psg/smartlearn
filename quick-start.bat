@echo off
echo ========================================
echo    SmartLearn Quick Start Script
echo ========================================
echo.

echo Step 1: Setting up backend environment...
cd backend
if not exist .env (
    copy env.example .env
    echo Created .env file. Please edit it with your database password.
    pause
) else (
    echo .env file already exists.
)

echo.
echo Step 2: Setting up database...
npm run setup-db
if %errorlevel% neq 0 (
    echo Database setup failed. Please check your PostgreSQL installation and password.
    pause
    exit /b 1
)

echo.
echo Step 3: Starting backend server...
start "SmartLearn Backend" cmd /k "npm run dev"

echo.
echo Step 4: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 5: Starting frontend...
cd ..
start "SmartLearn Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to open the frontend in your browser...
pause > nul
start http://localhost:5173 