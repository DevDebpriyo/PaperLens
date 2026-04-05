import os
from typing import Optional

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

load_dotenv()

_mongo_client: Optional[AsyncIOMotorClient] = None


def _get_mongo_uri() -> str:
    return (os.getenv("MONGODB_URI") or os.getenv("MONGO_URI") or "").strip()


def get_mongo_client() -> Optional[AsyncIOMotorClient]:
    global _mongo_client

    if _mongo_client is not None:
        return _mongo_client

    mongo_uri = _get_mongo_uri()
    if not mongo_uri:
        print("MongoDB connection skipped: MONGODB_URI/MONGO_URI is not set.")
        return None

    try:
        _mongo_client = AsyncIOMotorClient(
            mongo_uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=None,
            maxPoolSize=150,
            minPoolSize=10,
            retryWrites=True,
            readPreference="primary",
        )
        print("MongoDB client initialized successfully.")
        return _mongo_client
    except Exception as exc:
        _mongo_client = None
        print(f"MongoDB initialization failed: {exc}")
        return None


def get_mongo_database() -> Optional[AsyncIOMotorDatabase]:
    client = get_mongo_client()
    if client is None:
        return None

    database_name = (
        os.getenv("MONGODB_DATABASE")
        or os.getenv("MONGO_DATABASE")
        or "paperlens"
    ).strip()

    return client[database_name]


def get_chat_collection() -> Optional[AsyncIOMotorCollection]:
    database = get_mongo_database()
    if database is None:
        return None

    collection_name = (os.getenv("MONGODB_CHAT_COLLECTION") or "chat_messages").strip()
    return database[collection_name]
