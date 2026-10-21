@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   🐱 NekoReader - Configuração Inicial
echo ============================================
echo.

:: Verificar se Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo ╔══════════════════════════════════════════════╗
    echo ║  Por favor, instale o Node.js primeiro:     ║
    echo ║  https://nodejs.org (versão 18 ou superior) ║
    echo ╚══════════════════════════════════════════════╝
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado:
node --version
echo.

:: Instalar dependências
echo 📦 Instalando dependências npm...
echo    (Isso pode levar alguns minutos na primeira vez...)
echo.
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)
echo ✅ Dependências instaladas!
echo.

:: Configurar package.json para Electron
echo 🔧 Configurando package.json para Electron...
node electron/setup.js
if %errorlevel% neq 0 (
    echo ❌ Erro ao configurar package.json!
    pause
    exit /b 1
)
echo.

:: Criar ícone placeholder
echo 🎨 Criando ícone placeholder...
node electron/create-icon.js
echo.

:: Build inicial
echo 🔨 Compilando aplicação...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro ao compilar!
    pause
    exit /b 1
)
echo ✅ Build concluído!
echo.

:: Ajustar paths
echo 🔧 Ajustando paths para Electron...
node electron/fix-paths.js
echo.

echo ============================================
echo   ✅ Configuração Completa!
echo ============================================
echo.
echo Agora você pode:
echo.
echo   🚀 TESTE-NPM.cmd        → Rodar o app
echo   📦 BUILD-PORTABLE.cmd   → Gerar EXE portátil
echo   📥 BUILD-INSTALLER.cmd  → Gerar instalador
echo.
echo Ou via npm:
echo   npm run electron:dev
echo   npm run electron:build
echo   npm run electron:installer
echo.
pause
