import subprocess

def main():
    processes = []
    try:
        tiktok_live_process = subprocess.Popen([
            "python", "services/TikTokLiveService.py",
        ])

        mitm_proxy_process = subprocess.Popen([
            "mitmdump", "-s", "services/MitmProxyService.py", "--mode", "regular"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        websocket_process = subprocess.Popen([
            "python", "services/WebSocketService.py"
        ])

        processes.extend([tiktok_live_process, websocket_process, websocket_process])
        
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