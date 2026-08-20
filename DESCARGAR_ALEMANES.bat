@echo off
chcp 65001 >nul
setlocal
set "PROJ=%~dp0"
set "POT=C:\Users\aleja\yt-dlp-potoken\server\build\generate_once.js"
set "POT_TS=C:\Users\aleja\yt-dlp-potoken\server\src\generate_once.ts"
set "NM=C:\Users\aleja\yt-dlp-potoken\server\node_modules"
set "CACHE=%USERPROFILE%\.cache\bgutil-ytdlp-pot-provider"
set "DENO=%PROJ%deno.exe"
set "COOKIES=%PROJ%cookies.txt"
set "OUT=%PROJ%public\assets\yt-alemanes"
set "PATH=C:\Program Files\nodejs;%PATH%"
if not exist "%OUT%" mkdir "%OUT%"
cd /d "%USERPROFILE%"
echo ============================================================
echo   VIDEO 4 "COCHES ALEMANES USADOS"  (HD con PO Token)
echo ============================================================
echo.
echo [1/2] Pre-calentando el generador de token (deno)...
"%DENO%" run --allow-env --allow-net "--allow-ffi=%NM%" "--allow-write=%CACHE%" "--allow-read=%CACHE%,%NM%" "%POT_TS%" --version
echo.
echo [2/2] Descargando 12 clips en 1080p...  (pulsa una tecla)
pause >nul
echo.
set FMT=bv*[height^<=1080][vcodec^^=avc1]/bv[height^<=1080]/b[height^<=1080]
set OPTS=--cookies "%COOKIES%" --no-playlist --no-continue --force-overwrites --retries 15 --fragment-retries 15 --js-runtimes "deno:%DENO%" --extractor-args "youtube:player_client=android_vr" --extractor-args "youtubepot-bgutilscript:script_path=%POT%"

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
del "%OUT%\marca-%~1.hd.mp4" 2>nul
python -m yt_dlp %OPTS% -f "%FMT%" -o "%OUT%\marca-%~1.hd.%%(ext)s" "%~2"
if exist "%OUT%\marca-%~1.hd.mp4" (
  move /y "%OUT%\marca-%~1.hd.mp4" "%OUT%\marca-%~1.mp4" >nul
  echo   -^> HD OK
) else (
  echo   -^> HD fallo, se conserva el 360p
)
echo.
exit /b

:fin
echo ============================================================
echo   LISTO. Comprueba que hay 12 .mp4 en public\assets\yt-alemanes
echo   y vuelve al chat: di "descargadas".
echo   Si alguna da 403: es YouTube frenando el HD. Espera un rato o
echo   re-exporta cookies.txt (Get cookies.txt LOCALLY) y reejecuta.
echo ============================================================
pause
