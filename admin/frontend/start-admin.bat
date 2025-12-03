@echo off
cd /d "%~dp0"
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
echo Installing dependencies...
call npm install --legacy-peer-deps
echo.
echo Starting admin frontend...
call npm run dev
pause
