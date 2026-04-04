from fastapi import APIRouter
from pydantic import BaseModel
from handlers import generate_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response = generate_response(request.message)
        return {"response": response}, 200
    except Exception as e:
        return {"error": str(e)}, 500
