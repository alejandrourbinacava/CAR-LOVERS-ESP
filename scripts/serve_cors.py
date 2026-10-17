#!/usr/bin/env python3
"""serve_cors.py <carpeta> [puerto=8765] [minutos=60]

Servidor LOCAL y restringido para que la página de YouTube Studio pueda leer un vídeo grande y
rellenar su recuadro de subida (la herramienta de Chrome solo admite 10 MB):
  - escucha SOLO en 127.0.0.1 (no accesible desde la red ni desde internet)
  - sirve SOLO los archivos de <carpeta> (poner ahí únicamente el vídeo/miniatura a subir)
  - responde SOLO a peticiones cuyo Origin sea https://studio.youtube.com (cualquier otro -> 403)
  - se apaga solo pasados <minutos>
"""
import os, sys, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.abspath(sys.argv[1])
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
MINUTES = float(sys.argv[3]) if len(sys.argv) > 3 else 60
ALLOWED = "https://studio.youtube.com"


class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def _origin_ok(self):
        return self.headers.get("Origin") == ALLOWED

    def _deny(self):
        self.send_response(403)
        self.send_header("Content-Length", "0")
        super().end_headers()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", ALLOWED)
        self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Allow-Headers", "range")
        super().end_headers()

    def do_OPTIONS(self):
        if not self._origin_ok():
            return self._deny()
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if not self._origin_ok() or ".." in self.path:
            return self._deny()
        super().do_GET()

    def do_HEAD(self):
        if not self._origin_ok():
            return self._deny()
        super().do_HEAD()

    def list_directory(self, path):
        self.send_error(404)  # sin listado de archivos

    def log_message(self, *a):
        pass


srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
threading.Timer(MINUTES * 60, srv.shutdown).start()
print(f"sirviendo {ROOT} en http://127.0.0.1:{PORT} solo para {ALLOWED} durante {MINUTES:g} min", flush=True)
srv.serve_forever()
