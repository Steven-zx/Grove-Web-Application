@echo off
echo Starting Admin Frontend...
cd /d "%~dp0admin\frontend"
call npm run dev
pause