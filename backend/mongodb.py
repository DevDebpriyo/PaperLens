from dotenv import load_dotenv
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv('RAID_DATA_MONGO_URI')
try:
    raid_client = AsyncIOMotorClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=None, 
        maxPoolSize=150,
        minPoolSize=10,
        retryWrites=True,
        readPreference='primary',
    )
    print("Connected to MongoDB successfully (optimized async with connection pooling)!")
except Exception as e:
    raid_client = None
    print(f"An error occurred: {e}")
