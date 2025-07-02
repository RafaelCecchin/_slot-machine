import asyncio
from redis.asyncio import Redis
import json
from TikTokLive import TikTokLiveClient
from TikTokLive.events import ConnectEvent, CommentEvent, GiftEvent

client: TikTokLiveClient = TikTokLiveClient(unique_id="alyson7tkk")

redis = None

@client.on(ConnectEvent)
async def on_connect(event: ConnectEvent):
    print(f"Connected to @{event.unique_id} (Room ID: {client.room_id})")

@client.on(GiftEvent)
async def on_gift(event: GiftEvent) -> None:
    message = json.dumps({
        "type": "gift",
        "username": event.user.nickname,
        "gift": event.gift.name,
    })
    await redis.rpush("messages", message)

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
    redis = Redis.from_url("redis://redis:6379", decode_responses=True)
    await client.start()
    await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())
