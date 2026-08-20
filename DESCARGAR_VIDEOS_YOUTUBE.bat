@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem Añadir esta carpeta al PATH para que yt-dlp encuentre deno.exe (motor JS
rem que resuelve el "n challenge" de YouTube).
set "PATH=%~dp0;%PATH%"
echo.
echo ============================================================
echo   DESCARGA DE VIDEOS DE YOUTUBE  ^(para el canal de coches^)
echo ============================================================
echo.
echo   Usando cookies.txt ^(no hace falta cerrar Chrome^).
echo.
pause
echo.
echo   Descargando a la carpeta input\youtube ...
echo.

yt-dlp.exe --cookies "cookies.txt" --no-playlist -f "bv*[height<=1080][vcodec^^=avc1]/bv[height<=1080]/b[height<=720]" -o "input/youtube/%%(title)s.%%(ext)s" ^
  "https://www.youtube.com/watch?v=PHvfXEASofk" ^
  "https://www.youtube.com/watch?v=FmRMvu4f8Tw" ^
  "https://www.youtube.com/watch?v=5bvuXjG6tKQ" ^
  "https://www.youtube.com/watch?v=uTb3OGntqso" ^
  "https://www.youtube.com/watch?v=jyPtKCg-upA" ^
  "https://www.youtube.com/watch?v=cVSnRT1m4ZM" ^
  "https://www.youtube.com/watch?v=rF4YxDbjNsE" ^
  "https://www.youtube.com/watch?v=vpSpZh6SGW8" ^
  "https://www.youtube.com/watch?v=xPwcSDu1H-E" ^
  "https://www.youtube.com/watch?v=D6Vbbt96Nzc" ^
  "https://www.youtube.com/watch?v=jHqAtvU5U34" ^
  "https://www.youtube.com/watch?v=BHq_vEtPkCg"

echo.
echo ============================================================
echo   LISTO. Los videos estan en input\youtube
echo   Ahora vuelve al chat y dime "descargados".
echo ============================================================
echo.
pause
