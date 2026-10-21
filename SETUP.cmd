@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   NekoReader - Initial Setup
echo ============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo.
    echo Please install Node.js first:
    echo https://nodejs.org (version 18 or higher)
    echo.
    pause
    exit /b 1
)

echo OK: Node.js found
node --version
echo.

:: Install dependencies
echo Installing npm dependencies...
echo    (This may take a few minutes the first time...)
echo.
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo OK: Dependencies installed
echo.

:: Configure package.json for Electron
echo Configuring package.json for Electron...
node electron/setup.cjs
if %errorlevel% neq 0 (
    echo ERROR: Failed to configure package.json!
    pause
    exit /b 1
)
echo.

:: Create placeholder icon
echo Creating placeholder icon...
node electron/create-icon.cjs
echo.

:: Initial build
echo Building app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo OK: Build complete
echo.

:: Fix paths
echo Fixing paths for Electron...
node electron/fix-paths.cjs
echo.

echo ============================================
echo   OK: Setup Complete!
echo ============================================
echo.
echo Now you can:
echo.
echo   TESTE-NPM.cmd        - Run the app
echo   BUILD-PORTABLE.cmd   - Generate portable EXE
echo   BUILD-INSTALLER.cmd  - Generate installer
echo.
echo Or via npm:
echo   npm run electron:dev
echo   npm run electron:build
echo   npm run electron:installer
echo.
pause
