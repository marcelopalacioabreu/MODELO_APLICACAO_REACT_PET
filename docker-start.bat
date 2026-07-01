@echo off
REM APLICAÇÃO MODELO - Script de Orquestração (Dev)
REM Desenvolvido por Senior Full-Stack AI Engineer

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
echo %INFO% Iniciando...
docker compose --profile dev up -d --build
echo %INFO% Aguardando estabilizacao (15 segundos)...
timeout /t 15 /nobreak >nul
call :seed
call :test
echo %OK% Sistema 100%% Operacional!
echo %OK% Acesso: https://localhost:81
goto :eof

:stop
echo %INFO% Parando containers...
docker compose down
echo %OK% Containers parados.
goto :eof

:restart
call :stop
call :start
goto :eof

:build
echo %INFO% Reconstruindo imagens...
docker compose build --no-cache
echo %OK% Build finalizado.
goto :eof

:logs
docker compose logs -f
goto :eof

:seed
echo %INFO% Executando runners de banco de dados: migracoes -> inicializadores -> auxiliares (modo force)...
docker compose exec -T backend npm run bd:migracoes -- --force
docker compose exec -T backend npm run bd:inicializadores -- --force
echo %OK% Runners de banco concluídos.
goto :eof

:test
echo %INFO% Executando teste de inicialização...
docker compose exec -T backend npm run bd:auxiliares -- --force
echo %OK% Teste de inicialização concluído.
goto :eof
