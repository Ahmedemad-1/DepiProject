@echo off
cd /d "%~dp0"

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo npm install failed!
    pause
    exit /b 1
)

echo Starting dev and mock servers...
start "Vite Dev Server" cmd /k "cd /d "%~dp0" && npm run dev"
start "Mock Server" cmd /k "cd /d "%~dp0" && npm run mock"

echo Waiting for servers to spin up...
timeout /t 4 /nobreak >nul

echo Opening http://localhost:5173/ ...
start "" "http://localhost:5173/"