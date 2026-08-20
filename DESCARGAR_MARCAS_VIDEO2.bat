@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=%~dp0;%PATH%"
echo ============================================================
echo   VIDEO 2: "7 coches que parecen caros pero son irrompibles"
echo   Descarga de videos por modelo (b-roll de cada coche)
echo ============================================================
echo.
pause
echo.
set FMT=bv*[height^<=1080][vcodec^^=avc1]/bv[height^<=1080]/b[height^<=720]

echo --- Los 7 protagonistas ---
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-lexusrx.%%(ext)s"     "https://www.youtube.com/watch?v=O-xgv5WQXaE"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-mazdacx5.%%(ext)s"    "https://www.youtube.com/watch?v=zwg-4gMiuEw"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-landcruiser.%%(ext)s" "https://www.youtube.com/watch?v=lfwrTQb_ycA"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-lexuses.%%(ext)s"     "https://www.youtube.com/watch?v=9zceQT674KI"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-outback.%%(ext)s"     "https://www.youtube.com/watch?v=Wkh8Vp4x_2E"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-forester.%%(ext)s"    "https://www.youtube.com/watch?v=4sFRLPDLo2g"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-accord.%%(ext)s"      "https://www.youtube.com/watch?v=vRfuXSp-N1Q"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-lexusgx.%%(ext)s"     "https://www.youtube.com/watch?v=93ifzV4rWJo"

echo --- Rivales que se comparan en el guion ---
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-bmwx5.%%(ext)s"       "https://www.youtube.com/watch?v=-lAE9sOJX5c"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-bmwx3.%%(ext)s"       "https://www.youtube.com/watch?v=MAxoXR2FKbQ"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-bmw5.%%(ext)s"        "https://www.youtube.com/watch?v=Lh4xMqL7GXM"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-audiq3.%%(ext)s"      "https://www.youtube.com/watch?v=CxV48azYp6w"
yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "%FMT%" -o "public/assets/youtube/marca-mercedesglc.%%(ext)s" "https://www.youtube.com/watch?v=KJe1yW_QMxQ"

echo.
echo ============================================================
echo   LISTO. Vuelve al chat y di "descargadas video 2".
echo ============================================================
pause
