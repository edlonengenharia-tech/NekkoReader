@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   🐱 NekoReader - Gerar EXE Portátil
echo ============================================
echo.

:: Verificar se Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Por favor, instale o Node.js em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado:
node --version
echo.

:: Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas com sucesso!
    echo.
)

:: Verificar se electron-builder está instalado
where electron-builder >nul 2>&1
if %errorlevel% neq 0 (
    if not exist "node_modules\.bin\electron-builder.cmd" (
        echo 📦 Instalando electron-builder...
        call npm install --save-dev electron-builder
        if %errorlevel% neq 0 (
            echo ❌ Erro ao instalar electron-builder!
            pause
            exit /b 1
        )
    )
)
echo ✅ electron-builder encontrado!
echo.

:: Criar ícone se não existir
if not exist "electron\assets\icon.png" (
    echo 🎨 Criando ícone placeholder...
    node electron/create-icon.js
    echo.
)

:: Build do React app
echo 🔨 Compilando aplicação React...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao compilar a aplicação!
    pause
    exit /b 1
)
echo ✅ Build concluído!
echo.

:: Corrigir paths para Electron
echo 🔧 Ajustando paths para Electron...
node electron/fix-paths.js
if %errorlevel% neq 0 (
    echo ❌ Erro ao ajustar paths!
    pause
    exit /b 1
)
echo ✅ Paths ajustados!
echo.

:: Gerar EXE portátil
echo 📦 Gerando EXE portátil com Electron Builder...
echo    (Isso pode levar alguns minutos...)
echo.

:: Usar o electron-builder local
set EBUILDER=node_modules\.bin\electron-builder.cmd
if not exist "%EBUILDER%" (
    echo ❌ electron-builder não encontrado!
    echo Tente executar: npm install --save-dev electron-builder
    pause
    exit /b 1
)

"%EBUILDER%" --win portable --config electron-builder.config.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao gerar o EXE!
    echo.
    echo Possíveis soluções:
    echo   1. Verifique se tem espaço em disco suficiente
    echo   2. Tente executar como Administrador
    echo   3. Desative temporariamente o antivírus
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   ✅ EXE Gerado com Sucesso!
echo ============================================
echo.
echo 📁 Arquivo: release\NekoReader-portable.exe
echo.
echo Você pode copiar este arquivo para qualquer
echo lugar e executá-lo sem instalação!
echo.

:: Abrir a pasta release
if exist "release\NekoReader-portable.exe" (
    echo 🚀 Abrindo pasta release...
    explorer release
)

echo.
pause
