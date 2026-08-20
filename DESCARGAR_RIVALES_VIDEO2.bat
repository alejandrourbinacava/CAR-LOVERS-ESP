@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=%~dp0;%PATH%"
echo ============================================================
echo   VIDEO 2 - RIVALES que faltaban (salen como imagen ahora)
echo ============================================================
echo.
pause
echo.
set FMT=bv*[height^<=1080][vcodec^^=avc1]/bv[height^<=1080]/b[height^<=720]

yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-rangerover.%%(ext)s" "https://www.youtube.com/watch?v=eiFmB3psH0I"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-defender.%%(ext)s"   "https://www.youtube.com/watch?v=gHqXU2bzROo"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-gle.%%(ext)s"        "https://www.youtube.com/watch?v=BWqTtJcIwEQ"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-clasec.%%(ext)s"     "https://www.youtube.com/watch?v=Oxiwi4fr-Mk"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-clasee.%%(ext)s"     "https://www.youtube.com/watch?v=RBUqmKfr9ms"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-bmw3.%%(ext)s"       "https://www.youtube.com/watch?v=vYQQlYD2I0g"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-audia4.%%(ext)s"     "https://www.youtube.com/watch?v=3m8ovuaOn38"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-audia6.%%(ext)s"     "https://www.youtube.com/watch?v=EN4bd5gNKoY"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-rav4.%%(ext)s"       "https://www.youtube.com/watch?v=9aho-0Q5o6k"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-camry.%%(ext)s"      "https://www.youtube.com/watch?v=6OwV5KhR_LU"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-passat.%%(ext)s"     "https://www.youtube.com/watch?v=lMrnjhMnfBw"

echo.
echo ============================================================
echo   LISTO. Vuelve al chat y di "rivales descargados".
echo ============================================================
pause
