import asyncio
import aioredis
from TikTokLive import TikTokLiveClient
from TikTokLive.events import ConnectEvent, CommentEvent

client: TikTokLiveClient = TikTokLiveClient(unique_id="dichlorophenolindopheno")

redis = None

@client.on(ConnectEvent)
async def on_connect(event: ConnectEvent):
    print(f"Connected to @{event.unique_id} (Room ID: {client.room_id})")

@client.on(CommentEvent)
async def on_comment(event: CommentEvent) -> None:
    comment = f"{event.user.nickname} -> {event.comment}"
    print(comment)
    await redis.rpush("comments", comment)

async def main():
    global redis
    redis = aioredis.from_url("redis://redis:6379", decode_responses=True)
    await client.start()
    await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())
