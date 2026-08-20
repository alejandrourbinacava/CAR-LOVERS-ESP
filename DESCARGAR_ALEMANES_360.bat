@echo off
chcp 65001 >nul
setlocal
set "PROJ=%~dp0"
set "DENO=%PROJ%deno.exe"
set "COOKIES=%PROJ%cookies.txt"
set "OUT=%PROJ%public\assets\yt-alemanes"
set "PATH=C:\Program Files\nodejs;%PATH%"
if not exist "%OUT%" mkdir "%OUT%"
cd /d "%USERPROFILE%"
echo ============================================================
echo   VIDEO 4 "ALEMANES" - DESCARGA 360p (BORRADOR)
echo   (esta calidad pasa el freno de YouTube; HD se hara luego)
echo ============================================================
echo.
pause
echo.
REM 360p (formato 18) via cliente android -> no lo frena YouTube. Sin PO Token.
set FMT=18/b[height^<=480][ext=mp4]/b[height^<=480]/b
set OPTS=--cookies "%COOKIES%" --no-playlist --no-continue --force-overwrites --retries 15 --js-runtimes "deno:%DENO%" --extractor-args "youtube:player_client=android,tv"

call :dl bmwserie3      https://youtu.be/ajeCEr-SRac
call :dl mercedesclasee https://youtu.be/IN7yz-fbXhs
call :dl audia6         https://youtu.be/-a9H7WPErX0
call :dl vwgolftdi      https://youtu.be/g1SwwbJ-f-8
call :dl bmwserie1      https://youtu.be/vQ3UZDYvZZY
call :dl mercedesclasea https://youtu.be/aEoU3pnJc_U
call :dl mazdacx5       https://youtu.be/CTtoSFehn2E
call :dl toyotarav4     https://youtu.be/8QYp_LYhT5g
call :dl lexusis        https://youtu.be/50AIZkKeF6g
call :dl hondacrv       https://youtu.be/AO3_tkuPgNM
call :dl suzukivitara   https://youtu.be/r6I6MnfDB-w
call :dl daciaduster    https://youtu.be/37Mxv8sISgs
goto :fin

:dl
echo === %~1 ===
python -m yt_dlp %OPTS% -f "%FMT%" -o "%OUT%\marca-%~1.%%(ext)s" "%~2"
echo.
exit /b

:fin
echo ============================================================
echo   LISTO (borrador 360p). Vuelve al chat: di "descargadas".
echo ============================================================
pause
