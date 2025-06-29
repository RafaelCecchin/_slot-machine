import subprocess

def main():
    processes = []
    try:
        tiktok_live_process = subprocess.Popen([
            "python", "services/TikTokLiveService.py",
        ])

        fastapi_process = subprocess.Popen([
            "fastapi", "run", "services/FastAPIService.py", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ])

        websocket_process = subprocess.Popen([
            "python", "services/WebSocketService.py"
        ])

        processes.extend([tiktok_live_process, fastapi_process, websocket_process])
        
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        print("Interrompido. Encerrando servidores...")
        for process in processes:
            process.terminate()
    finally:
        for process in processes:
            process.wait()

if __name__ == '__main__':
    main()