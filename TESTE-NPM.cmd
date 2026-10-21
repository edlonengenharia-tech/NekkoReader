@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   🐱 NekoReader - Teste e Execução
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

:: Executar o Electron
echo 🚀 Iniciando NekoReader...
echo.

:: Usar o electron local do node_modules
set ELECTRON=node_modules\.bin\electron.cmd
if not exist "%ELECTRON%" (
    echo ❌ Electron não encontrado em node_modules!
    echo Tente executar: npm install
    pause
    exit /b 1
)

:: Iniciar o Electron com o main.js
"%ELECTRON%" electron/main.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao executar o NekoReader!
    pause
    exit /b 1
)

echo.
echo ✅ NekoReader fechado.
echo.
pause
