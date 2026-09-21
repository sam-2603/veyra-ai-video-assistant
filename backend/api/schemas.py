from pydantic import BaseModel
from typing import Literal

Language = Literal["english", "hinglish"]


# class ProcessRequest(BaseModel):
#     source: str = Field(..., description="A YouTube URL to process.")
#     language: Language = "english"


class ProcessResponse(BaseModel):
    session_id: str
    title: str
    summary: str
    transcript: str
    action_items: str
    key_decisions: str
    open_questions: str


class ChatRequest(BaseModel):
    session_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str


class HealthResponse(BaseModel):
    status: str


class ErrorResponse(BaseModel):
    detail: str
