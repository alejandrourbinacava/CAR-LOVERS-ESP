@echo off
chcp 65001 >nul
cd /d "%~dp0"
REM ============================================================
REM  Sube los clips de una carpeta al Release y monta en la nube
REM  EDITA estas 2 líneas para cada vídeo:
REM ============================================================
set "SUBDIR=yt-alemanes"
set "TAG=clips-alemanes"
REM ------------------------------------------------------------
REM  Los clips deben llamarse marca-<clave>.mp4 y estar en
REM  public\assets\%SUBDIR%\  (o cambia la ruta abajo)
REM ============================================================
set "BASH=C:\Program Files\Git\bin\bash.exe"
if not exist "%BASH%" set "BASH=bash"
echo Subiendo clips de public/assets/%SUBDIR% al Release %TAG% y disparando montaje...
echo.
"%BASH%" "%~dp0scripts/subir-clips.sh" "public/assets/%SUBDIR%" "%TAG%" montar
echo.
echo LISTO. El vídeo se está montando en la nube:
echo   https://github.com/alejandrourbinacava/CAR-LOVERS-ESP/actions
echo Cuando termine, descarga el artifact "video-final".
pause
