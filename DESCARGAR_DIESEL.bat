@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
set "PROJ=%~dp0"
set "POT=C:\Users\aleja\yt-dlp-potoken\server\build\generate_once.js"
set "POT_TS=C:\Users\aleja\yt-dlp-potoken\server\src\generate_once.ts"
set "DENO=%PROJ%deno.exe"
set "COOKIES=%PROJ%cookies.txt"
set "OUT=%PROJ%public\assets\yt-diesel"
set "PATH=C:\Program Files\nodejs;%PATH%"
if not exist "%OUT%" mkdir "%OUT%"
cd /d "%USERPROFILE%"
echo ============================================================
echo   VIDEO 14 "DIESEL 2026"  - 10 clips HD (avc1 1080p)
echo ============================================================
echo.
echo Pre-calentando token...
"%DENO%" run -A "%POT_TS%" --version
echo.
echo Velocidad capada a 3 MB/s; cada clip reintenta hasta 6 veces y REANUDA.
echo Los clips ya completos se saltan. Dejalo correr sin tocar.
pause
echo.
set FMT=bv*[vcodec^^=avc1][height^<=1080]/bv[vcodec^^=avc1]/b[height^<=1080]
set OPTS=--cookies "%COOKIES%" --no-playlist --limit-rate 3M --sleep-requests 1 --retries 25 --fragment-retries 25 --js-runtimes "deno:%DENO%" --extractor-args "youtubepot-bgutilscript:script_path=%POT%"

REM Los 10 mejores (limite 10 descargas/dia): 1 clip largo por motor
call :dl renault  https://youtu.be/IbF3dFC3tyA
call :dl toyota   https://youtu.be/RuT4Hlro-Qw
call :dl psa      https://youtu.be/YuS6vyJd-w4
call :dl bluehdi  https://youtu.be/vlMsS2506Ks
call :dl vw19     https://youtu.be/wXuYRLLQ-oo
call :dl vw20     https://youtu.be/JEGReTnF3kg
call :dl merc     https://youtu.be/69a_FxO99Ng
call :dl bmw1     https://youtu.be/i0qJheD-sGo
call :dl bmw2     https://youtu.be/kI27eGUpNSU
call :dl moderno  https://youtu.be/ClMINZreNRQ
goto :fin

:dl
echo === %~1 ===
if exist "%OUT%\marca-%~1.mp4"  ( echo   -^> ya estaba ^(mp4^)  & echo. & exit /b )
if exist "%OUT%\marca-%~1.mkv"  ( echo   -^> ya estaba ^(mkv^)  & echo. & exit /b )
if exist "%OUT%\marca-%~1.webm" ( echo   -^> ya estaba ^(webm^) & echo. & exit /b )
set /a try=0
:retry
set /a try+=1
python -m yt_dlp %OPTS% -f "%FMT%" -o "%OUT%\marca-%~1.%%(ext)s" "%~2"
set "GOT="
for %%E in (mp4 mkv webm) do if exist "%OUT%\marca-%~1.%%E" set "GOT=%%E"
if defined GOT ( echo   -^> HD OK ^(!GOT!^) & echo. & exit /b )
if !try! lss 6 ( echo   intento !try! cortado; espero 25s y REANUDO... & timeout /t 25 /nobreak >nul & goto retry )
echo   -^> 6 intentos agotados; reejecuta el .bat mas tarde para terminarlo.
echo.
exit /b

:fin
echo ============================================================
echo   LISTO. Deberia haber 10 archivos en public\assets\yt-diesel
echo   Si falta alguno: reejecuta este .bat (reanuda lo que quede).
echo   Cuando esten los 10 -^> dime "descargadas".
echo ============================================================
pause
