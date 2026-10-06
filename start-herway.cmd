@echo off
title HerWay AI - Frontend Dev Server
cd /d "%~dp0"

echo ==========================================
echo   HerWay AI  -  Frontend Dev Server
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found on your PATH.
  echo         Install the LTS version from https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies. This runs only once and takes a few minutes...
  echo.
  call npm.cmd install
)

echo.
echo Starting Vite...
echo.
echo   URL:  http://localhost:5173
echo
echo   Keep THIS window open while you use the app.
echo   Press Ctrl+C to stop the server.
echo ==========================================
echo.

call npm.cmd run dev:frontend

echo.
echo Server stopped.
pause >nul