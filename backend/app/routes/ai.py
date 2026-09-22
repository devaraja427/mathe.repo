import time
from collections import defaultdict
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field
from ..services.ai_service import generate_ai_reply

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

# Simple in-memory rate limiting: max 30 requests per 60 seconds per client IP
RATE_LIMIT_WINDOW_SEC = 60
RATE_LIMIT_MAX_REQUESTS = 30
client_requests_history = defaultdict(list)


class ConversationMessage(BaseModel):
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., max_length=2000, description="Message content")


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User's input message")
    conversation: Optional[List[ConversationMessage]] = Field(
        default_factory=list,
        max_length=30,
        description="Prior conversation history",
    )
    page: Optional[str] = Field(default="dashboard", max_length=100, description="Current website page route")


class AIChatResponse(BaseModel):
    reply: str = Field(..., description="AI response markdown string")


def check_rate_limit(client_ip: str) -> bool:
    now = time.time()
    # Clean up timestamps older than window
    history = [t for t in client_requests_history[client_ip] if now - t < RATE_LIMIT_WINDOW_SEC]
    if len(history) >= RATE_LIMIT_MAX_REQUESTS:
        client_requests_history[client_ip] = history
        return False
    history.append(now)
    client_requests_history[client_ip] = history
    return True


@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(chat_req: AIChatRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"

    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a moment before sending more messages."
        )

    clean_message = chat_req.message.strip()
    if not clean_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    try:
        conversation_dicts = [
            {"role": m.role, "content": m.content}
            for m in (chat_req.conversation or [])
        ]

        reply = await generate_ai_reply(
            message=clean_message,
            conversation=conversation_dicts,
            page=chat_req.page or "dashboard"
        )

        return AIChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception:
        # Standard error without exposing internal stack trace or credentials
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sorry, I'm having trouble connecting right now. Please try again."
        )
