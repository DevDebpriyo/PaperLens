import asyncpg
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()


class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        self.pool = await asyncpg.create_pool(
            host=os.getenv("POSTGRES_ADDRESS"),
            port=os.getenv("POSTGRES_PORT"),
            database="postgres",
            user=os.getenv("POSTGRES_USERNAME"),
            password=os.getenv("POSTGRES_PASSWORD"),
            ssl="require",
            timeout=10,
            min_size=1,
            max_size=20,
            command_timeout=30,
            statement_cache_size=0,
        )
        print("Database connected successfully.")

    async def create_tables(self):
        try:
            async with self.pool.acquire() as conn:
                await conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS current_raids (
                        unique_id BIGINT PRIMARY KEY,
                        server_name TEXT,
                        server_id BIGINT,
                        channel_id BIGINT,
                        bot_name TEXT,
                        bot_id BIGINT,
                        spawn_time BIGINT,
                        end_time BIGINT,
                        raid_boss TEXT,
                        is_event BOOLEAN,
                        raid_tier INT,
                        raid_id TEXT,
                        raider_roles JSONB,
                        raider_required JSONB,
                        invite_link TEXT,
                        image_url TEXT,
                        saved_at BIGINT
                    )
                """
                )
        except Exception as e:
            print(f"Error creating tables: {e}")

    async def refresh_connection(self):
        if self.pool:
            try:
                async with self.pool.acquire() as conn:
                    await conn.execute("SELECT 1")
            except (
                asyncpg.exceptions.ConnectionDoesNotExistError,
                asyncpg.exceptions.ConnectionFailureError,
            ):
                print("Connection lost. Reconnecting...")
                await self.connect()

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            print("Database connection pool closed.")

    async def ensure_connected(self):
        if self.pool is None:
            await self.connect()


db = Database()

try:
    loop = asyncio.get_event_loop()
    if loop.is_running():
        asyncio.ensure_future(db.ensure_connected())
except RuntimeError:
    pass


async def main():
    await db.connect()

    try:
        while True:
            await db.refresh_connection()
            await asyncio.sleep(60)
    except asyncio.CancelledError:
        print("\nShutting down...")
        await db.disconnect()
    finally:
        if db.pool:
            await db.disconnect()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
