@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=%~dp0;%PATH%"
echo ============================================================
echo   DESCARGA DE VIDEOS POR MARCA  (b-roll de cada coche)
echo   Se guardan etiquetados en public\assets\youtube
echo ============================================================
echo.
pause
echo.
set FMT=bv*[height^<=1080][vcodec^^=avc1]/bv[height^<=1080]/b[height^<=720]

yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-golf.%%(ext)s"     "https://www.youtube.com/watch?v=KUWL7m-TdBU"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-troc.%%(ext)s"     "https://www.youtube.com/watch?v=UG9N0TUf7bA"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-tiguan.%%(ext)s"   "https://www.youtube.com/watch?v=je9mYANzAP8"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-corolla.%%(ext)s"  "https://www.youtube.com/watch?v=wNMjAdG5L0k"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-ford.%%(ext)s"     "https://www.youtube.com/watch?v=qTAsA8CVCds"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-mondeo.%%(ext)s"   "https://www.youtube.com/watch?v=Qzc_ZmtGBMs"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-insignia.%%(ext)s" "https://www.youtube.com/watch?v=372vrUT0U5U"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-leon.%%(ext)s"     "https://www.youtube.com/watch?v=wLiuQBRN5zU"

echo.
echo ============================================================
echo   LISTO. Vuelve al chat y di "descargadas".
echo ============================================================
pause
