@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   NekoReader - Test and Run
echo ============================================
echo.

:: Check Node.js
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

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo OK: Dependencies installed
    echo.
)

:: Create icon if not exists
if not exist "electron\assets\icon.png" (
    echo Creating placeholder icon...
    node electron/create-icon.cjs
    echo.
)

:: Build React app
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
if %errorlevel% neq 0 (
    echo ERROR: Failed to fix paths!
    pause
    exit /b 1
)
echo OK: Paths fixed
echo.

:: Run Electron
echo Starting NekoReader...
echo.

set ELECTRON=node_modules\.bin\electron.cmd
if not exist "%ELECTRON%" (
    echo ERROR: Electron not found in node_modules!
    echo Try running: npm install
    pause
    exit /b 1
)

"%ELECTRON%" electron/main.cjs

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to run NekoReader!
    pause
    exit /b 1
)

echo.
echo OK: NekoReader closed.
echo.
pause
