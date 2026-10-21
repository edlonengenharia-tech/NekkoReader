@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   AutoComix Backend Server
echo ============================================
echo.

:: Verificar se Python está instalado
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    echo Please install Python 3.10+ from: https://python.org
    pause
    exit /b 1
)

echo OK: Python found
python --version
echo.

:: Verificar se o ambiente virtual existe
if not exist "venv" (
    echo Creating virtual environment...
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
    echo Installing dependencies...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo OK: Dependencies installed
    echo.
)

:: Verificar se o AutoComix está instalado
if exist "%AUTOCOMIX_PATH%\autocomix" (
    echo OK: AutoComix found at %AUTOCOMIX_PATH%
) else (
    echo WARNING: AutoComix not found
    echo Set AUTOCOMIX_PATH environment variable to use full features
    echo Using fallback detection (OpenCV only)
    echo.
)

:: Iniciar servidor
echo Starting AutoComix Backend Server...
echo Server will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python server.py

pause
