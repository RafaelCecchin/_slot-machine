import asyncio
import aioredis
import json
from TikTokLive import TikTokLiveClient
from TikTokLive.events import ConnectEvent, CommentEvent

client: TikTokLiveClient = TikTokLiveClient(unique_id="flavianasushiwoman")

redis = None

@client.on(ConnectEvent)
async def on_connect(event: ConnectEvent):
    print(f"Connected to @{event.unique_id} (Room ID: {client.room_id})")

@client.on(CommentEvent)
async def on_comment(event: CommentEvent) -> None:
    message = json.dumps({
        "type": "comment",
        "username": event.user.nickname,
        "comment": event.comment,
    })
    await redis.rpush("messages", message)

async def main():
    global redis
    redis = aioredis.from_url("redis://redis:6379", decode_responses=True)
    await client.start()
    await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())
