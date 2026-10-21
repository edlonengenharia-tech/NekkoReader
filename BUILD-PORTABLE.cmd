@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   NekkoReader - Build Portable EXE
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

:: Check electron-builder
if not exist "node_modules\.bin\electron-builder.cmd" (
    echo Installing electron-builder...
    call npm install --save-dev electron-builder
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install electron-builder!
        pause
        exit /b 1
    )
)
echo OK: electron-builder found
echo.

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

:: Generate portable EXE
echo Generating portable EXE...
echo    (This may take a few minutes...)
echo.

node_modules\.bin\electron-builder.cmd --win portable --config electron-builder.config.cjs

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to generate EXE!
    echo.
    echo Possible solutions:
    echo   1. Check disk space
    echo   2. Try running as Administrator
    echo   3. Temporarily disable antivirus
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   OK: EXE Generated Successfully!
echo ============================================
echo.
echo File: release\NekkoReader-portable.exe
echo.
echo You can copy this file anywhere and run it!
echo.

if exist "release\NekoReader-portable.exe" (
    echo Opening release folder...
    explorer release
)

echo.
pause
