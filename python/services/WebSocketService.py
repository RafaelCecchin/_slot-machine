import asyncio
import websockets
import aioredis

connected_clients = set()

async def websocket_handler(websocket):
    print("Novo cliente conectado.")
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)
        print("Cliente desconectado e removido.")

async def broadcast_comments():
    redis = aioredis.from_url("redis://redis:6379", decode_responses=True)
    while True:
        _, comment = await redis.blpop("comments")
        print(f"Enviando: {comment}")

        to_remove = set()
        for ws in connected_clients:
            try:
                await ws.send(comment)
            except (websockets.ConnectionClosed, websockets.ConnectionClosedError, websockets.ConnectionClosedOK):
                print("Cliente desconectado, removendo da lista.")
                to_remove.add(ws)
            except Exception as e:
                print(f"Erro ao enviar para cliente: {e}")
                to_remove.add(ws)

        for ws in to_remove:
            connected_clients.remove(ws)

async def main():
    server = await websockets.serve(websocket_handler, "0.0.0.0", 8765)
    print("WebSocket iniciado.")
    await asyncio.gather(server.wait_closed(), broadcast_comments())

if __name__ == "__main__":
    asyncio.run(main())
