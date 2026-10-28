@echo off
echo ===================================================
echo             Starting SAKHI AI Platform
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Backend API (FastAPI)...
start "SAKHI Backend" /min "%~dp0backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000

timeout /t 2 /nobreak >nul

echo [2/3] Starting Frontend (Vite + React)...
start "SAKHI Frontend" /min cmd /c "npm --prefix frontend run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening SAKHI AI in your default web browser...
start http://localhost:5173

echo.
echo ===================================================
echo  SAKHI AI is running!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://127.0.0.1:8000
echo ===================================================
echo You can minimize this window.
pause
