@echo off
echo =======================================================
echo Starting Smart School Portal (Backend + Frontend)
echo =======================================================
start "Smart School Backend (Port 5050)" cmd /k "cd /d "%~dp0backend" && node server.js"
start "Smart School Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo Both servers launched in separate windows!
echo Open your browser at: http://localhost:3000
pause
