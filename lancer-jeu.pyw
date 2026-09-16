"""Desktop launcher: local-only server for this exact VJ Simulator copy."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen
import ctypes
import hashlib
import sys
import threading
import webbrowser

ROOT = Path(__file__).resolve().parent
URL = 'http://127.0.0.1:5187/'

class GameHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def correct_server():
    try:
        with urlopen(URL + 'index.html', timeout=4) as response:
            return hashlib.sha256(response.read()).digest() == hashlib.sha256((ROOT / 'index.html').read_bytes()).digest()
    except OSError:
        return False


def main():
    if not (ROOT / 'index.html').is_file():
        raise RuntimeError('Le dossier du jeu est introuvable.')
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 5187), partial(GameHandler, directory=str(ROOT)))
    except OSError:
        if not correct_server():
            raise RuntimeError('Le port 5187 est utilise par un autre programme. Le jeu ne peut pas demarrer sur ce port.')
        webbrowser.open(URL, new=2)
        return
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    if not correct_server():
        server.shutdown()
        server.server_close()
        raise RuntimeError('Le serveur du jeu ne repond pas correctement.')
    webbrowser.open(URL, new=2)
    worker.join()


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        ctypes.windll.user32.MessageBoxW(None, str(error), 'VJ Simulator - Refonte physique', 0x10)
        sys.exit(1)
