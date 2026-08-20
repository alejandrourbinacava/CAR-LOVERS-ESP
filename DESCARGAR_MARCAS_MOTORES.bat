@echo off
chcp 65001 >nul
REM IMPORTANTE: NO metemos la carpeta del proyecto en PATH (si bgutil ve deno.exe
REM en el directorio actual, intenta compilar con deno y falla por timeout).
REM Trabajamos desde una carpeta neutra y pasamos rutas absolutas.
set "PROJ=%~dp0"
set "POT=C:\Users\aleja\yt-dlp-potoken\server\build\generate_once.js"
set "DENO=%PROJ%deno.exe"
set "COOKIES=%PROJ%cookies.txt"
set "OUT=%PROJ%public\assets\yt-motores"
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%USERPROFILE%"
echo ============================================================
echo   VIDEO "MEJORES MOTORES DE CADA MARCA"  (HD con PO Token)
echo   Clips PROPIOS de este video -> yt-motores
echo ============================================================
echo.
set FMT=bv*[height^<=1080][vcodec^^=avc1]/bv[height^<=1080]/b[height^<=1080]
set OPTS=--cookies "%COOKIES%" --no-playlist --no-continue --force-overwrites --retries 10 --fragment-retries 10 --js-runtimes "deno:%DENO%" --extractor-args "youtubepot-bgutilscript:script_path=%POT%"

for %%V in (^
 "toyotacorolla=https://youtu.be/UbsWllwgDFk"^
 "hondacivic=https://youtu.be/Dga-4-VuiJU"^
 "mazda3=https://youtu.be/kR99SqZSwUo"^
 "vwgolf=https://youtu.be/qzBIw6UGwFs"^
 "bmw340i=https://youtu.be/w37SVXcAlDY"^
 "mercedeseclass=https://youtu.be/NsmWGv5yE8s"^
 "fordmondeo=https://youtu.be/d7p6s3FiPe4"^
 "subaruforester=https://youtu.be/HkWf8p92sio"^
 "hyundaii30=https://youtu.be/2GBv16bakk8"^
 "kiaceed=https://youtu.be/3Sb_2NkqPM8"^
 "renaultmegane=https://youtu.be/YaxIlhE6Q1Q"^
 "renaultclio=https://youtu.be/LwaeZnsruRw"^
) do (
  for /f "tokens=1,2 delims==" %%A in (%%V) do (
    echo === %%A ===
    python -m yt_dlp %OPTS% -f "%FMT%" -o "%OUT%\marca-%%A.%%(ext)s" "%%B"
  )
)

echo.
echo ============================================================
echo   LISTO. Vuelve al chat y di "descargadas".
echo ============================================================
pause
