@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   NekkoReader with AutoComix Backend
echo ============================================
echo.

:: Verificar se Python está instalado
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    echo Please install Python 3.10+ from: https://python.org
    echo.
    echo You can still run NekkoReader without AutoComix backend.
    echo Run TESTE-NPM.cmd instead.
    echo.
    pause
    exit /b 1
)

echo OK: Python found
python --version
echo.

:: Verificar se Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo OK: Node.js found
node --version
echo.

:: Iniciar backend Python em background
echo Starting AutoComix Backend Server...
cd autocomix-backend

:: Verificar se o ambiente virtual existe
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo OK: Virtual environment created
    echo.
)

:: Ativar ambiente virtual
call venv\Scripts\activate.bat

:: Instalar dependências se necessário
if not exist "venv\Lib\site-packages\flask" (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Python dependencies!
        pause
        exit /b 1
    )
    echo OK: Python dependencies installed
    echo.
)

:: Iniciar servidor Python em background
start "AutoComix Backend" /B python server.py

:: Aguardar servidor iniciar
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

:: Verificar se servidor está rodando
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend server may not have started correctly
    echo Continuing anyway...
    echo.
) else (
    echo OK: Backend server is running
    echo.
)

cd ..

:: Verificar se Node modules existem
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Node.js dependencies!
        pause
        exit /b 1
    )
    echo OK: Node.js dependencies installed
    echo.
)

:: Build do React app
echo Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo OK: Build complete
echo.

:: Fix paths for Electron
echo Fixing paths for Electron...
node electron/fix-paths.cjs
echo.

:: Iniciar NekkoReader
echo Starting NekkoReader...
echo.
echo ============================================
echo   NekkoReader is running!
echo   Backend: http://localhost:5000
echo ============================================
echo.
echo Press Ctrl+C in this window to stop everything
echo.

set ELECTRON=node_modules\.bin\electron.cmd
"%ELECTRON%" electron/main.cjs

:: Parar backend quando Electron fechar
echo.
echo Stopping AutoComix Backend...
taskkill /FI "WINDOWTITLE eq AutoComix Backend*" >nul 2>&1
echo OK: Backend stopped
echo.

pause
