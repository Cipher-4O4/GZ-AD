import socketserver
import subprocess

class ClientHandler(socketserver.BaseRequestHandler):
    def handle(self):
        p = subprocess.Popen(
            ["python3", "-u", "/app/app.py"],
            stdin=self.request,
            stdout=self.request,
            stderr=self.request
        )
        p.wait()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    print("[Playground Server] Listening on 0.0.0.0:6969...", flush=True)
    server = ThreadedTCPServer(("0.0.0.0", 6969), ClientHandler)
    server.serve_forever()
