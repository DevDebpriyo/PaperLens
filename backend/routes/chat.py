from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

from handlers import generate_response
from mongodb import get_chat_collection

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    client_id: Optional[str] = None


def _to_iso_timestamp(value: Any) -> str:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc).isoformat()
    return datetime.now(timezone.utc).isoformat()


def _preview(text: str, max_chars: int = 90) -> str:
    normalized = " ".join(text.split())
    if len(normalized) <= max_chars:
        return normalized
    return f"{normalized[:max_chars].rstrip()}..."


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response_text = generate_response(request.message)

    created_at = datetime.now(timezone.utc)
    client_id = (request.client_id or "anonymous").strip() or "anonymous"
    stored = False

    chat_collection = get_chat_collection()
    if chat_collection is not None:
        document = {
            "client_id": client_id,
            "user_message": request.message,
            "user_preview": _preview(request.message),
            "assistant_message": response_text,
            "created_at": created_at,
        }

        try:
            await chat_collection.insert_one(document)
            stored = True
        except Exception as exc:
            # Storage failures should not block chat responses.
            print(f"Chat persistence failed: {exc}")

    return {
        "response": response_text,
        "stored": stored,
        "createdAt": created_at.isoformat(),
    }


async def _load_chat_history(
    client_id: str = Query(..., min_length=1),
    limit: int = Query(40, ge=1, le=200),
):
    chat_collection = get_chat_collection()
    if chat_collection is None:
        return {"history": []}

    history_items: List[Dict[str, str]] = []

    try:
        cursor = (
            chat_collection.find(
                {"client_id": client_id},
                {"user_preview": 1, "user_message": 1, "created_at": 1},
            )
            .sort("created_at", -1)
            .limit(limit)
        )

        async for document in cursor:
            preview_text = str(document.get("user_preview") or "").strip()
            if not preview_text:
                preview_text = _preview(str(document.get("user_message") or ""))

            if not preview_text:
                continue

            history_items.append(
                {
                    "id": str(document.get("_id")),
                    "text": preview_text,
                    "createdAt": _to_iso_timestamp(document.get("created_at")),
                }
            )
    except Exception as exc:
        print(f"Chat history fetch failed: {exc}")
        return {"history": []}

    return {"history": history_items}


@router.get("/chat")
async def chat_history(
    client_id: str = Query(..., min_length=1),
    limit: int = Query(40, ge=1, le=200),
):
    return await _load_chat_history(client_id=client_id, limit=limit)


@router.get("/chat/history")
async def chat_history_legacy(
    client_id: str = Query(..., min_length=1),
    limit: int = Query(40, ge=1, le=200),
):
    return await _load_chat_history(client_id=client_id, limit=limit)
