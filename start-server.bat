@echo off
echo Starting Keys'n'Caps Server...
cd "%~dp0"
call npm run start
echo Server started! Check status with: npm run status
pause
