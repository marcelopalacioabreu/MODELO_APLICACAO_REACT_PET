@echo off
REM APLICAÇÃO MODELO - Script de inicialização
REM Desenvolvido por dev

setlocal enabledelayedexpansion

REM Cores para output
set "INFO=[INFO]"
set "OK=[SUCESSO]"
set "WARN=[ATENCAO]"
set "ERR=[ERRO]"

REM Menu Principal
if "%1"=="" goto start
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="build" goto build
if "%1"=="logs" goto logs
if "%1"=="seed" goto seed
if "%1"=="test" goto test

echo Uso: %0 {start^|stop^|restart^|build^|logs^|seed^|test}
exit /b 1

:start
echo %INFO% Iniciando em modo local (NPM) - executando runners e subindo backend/frontend...

REM Subir backend e frontend em janelas separadas
echo %INFO% Iniciando backend (nodemon)...
start "backend" cmd /k "cd /d backend && call npm run dev"
timeout /t 2 /nobreak >nul
echo %INFO% Iniciando frontend (next)...
start "frontend" cmd /k "cd /d frontend && npm run dev"

REM Executa runners na ordem: migracoes -> inicializadores -> auxiliares
echo %INFO% Executando runners de banco de dados (force)...
call npm --prefix backend run bd:migracoes -- --force
call npm --prefix backend run bd:inicializadores -- --force
call npm --prefix backend run bd:auxiliares -- --force
echo %OK% Runners concluídos.

echo %OK% Backend e Frontend iniciados em janelas separadas.
echo %INFO% Aguardar alguns segundos para estabilizacao antes de abrir o navegador.
timeout /t 5 /nobreak >nul
echo %OK% Acesso frontend: http://localhost:3000 ^| backend: http://localhost:5001/api
goto :eof

:stop
echo %INFO% Parando processos Node (backend/frontend)...
REM Isso encerrará processos Node; use com cuidado.
taskkill /F /IM node.exe >nul 2>&1 || echo %WARN% Nenhum processo node encontrado.
taskkill /F /IM npm.exe >nul 2>&1 || echo %WARN% Nenhum processo npm encontrado.
echo %OK% Processos encerrados.
goto :eof

:restart
call :stop
call :start
goto :eof

:build
echo %INFO% Build (frontend)...
cd frontend && call npm install && call npm run build
cd ..
cd ..
echo %OK% Build frontend concluido.
goto :eof

:logs
echo %INFO% Logs: os servidores estão rodando em janelas separadas; verifique as janelas "backend" e "frontend".
echo %INFO% Para inspecionar logs do backend via arquivo ou stdout, rode manualmente em uma sessão.
goto :eof

:seed
echo %INFO% Executando runners de banco de dados (force)...
call npm --prefix backend run bd:migracoes -- --force
call npm --prefix backend run bd:inicializadores -- --force
echo %OK% Runners de banco concluídos.
goto :eof

:test
echo %INFO% Executando teste de inicialização (auxiliares)...
call npm --prefix backend run bd:auxiliares -- --force
echo %OK% Teste de inicialização concluído.
goto :eof
