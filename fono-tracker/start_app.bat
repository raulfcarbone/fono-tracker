@echo off
title FonoTracker Launcher
color 0b
echo ====================================================
echo        INICIANDO FONO-TRACKER V1.0
echo ====================================================
echo.

cd /d "%~dp0"

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit
)

:: Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] Primera vez iniciando. Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Fallo al instalar dependencias.
        pause
        exit
    )
)

echo.
echo [INFO] Iniciando servidor...
echo [INFO] Se abrira tu navegador automaticamente.
echo.
echo Puedes minimizar esta ventana, pero NO la cierres mientras uses la app.
echo.

:: Open browser after a slight delay to ensure server is starting
timeout /t 3 >nul
start http://localhost:5173

:: Start the app
call npm run dev
