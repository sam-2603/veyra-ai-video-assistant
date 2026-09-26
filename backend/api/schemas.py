from pydantic import BaseModel
from typing import Literal


class ProcessResponse(BaseModel):
    session_id: str
    title: str
    summary: str
    transcript: str
    action_items: str
    key_decisions: str
    open_questions: str
    sync_analysis: dict


class ChatRequest(BaseModel):
    session_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str


class HealthResponse(BaseModel):
    status: str


class ErrorResponse(BaseModel):
    detail: str