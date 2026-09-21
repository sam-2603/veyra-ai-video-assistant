

import logging
import os
import tempfile
import traceback

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from main import run_pipeline
from core.rag_engine import ask_question
from api.schemas import (
    ProcessResponse,
    ChatRequest,
    ChatResponse,
    HealthResponse,
)
from api.session_store import create_session_id, save_session, get_session

logger = logging.getLogger("api")

router = APIRouter(prefix="/api")

ALLOWED_UPLOAD_EXTENSIONS = {
    ".mp4", ".mov", ".mkv", ".avi", ".webm",
    ".mp3", ".wav", ".m4a", ".aac", ".flac",
}


def _to_process_response(session_id: str, result: dict) -> ProcessResponse:
    # `result` is the dict returned by run_pipeline(). We deliberately do NOT
    # forward result["rag_chain"] to the client — it is a Python object
    # (an LCEL runnable) and is not JSON serializable. It stays server-side,
    # keyed by session_id, in the session store.
    return ProcessResponse(
        session_id=session_id,
        title=result["title"],
        summary=result["summary"],
        transcript=result["transcript"],
        action_items=result["action_items"],
        key_decisions=result["key_decisions"],
        open_questions=result["open_questions"],
    )


@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok")


# @router.post("/process", response_model=ProcessResponse)
# def process_video(payload: ProcessRequest):
#     source = payload.source.strip()

#     if not (source.startswith("http://") or source.startswith("https://")):
#         raise HTTPException(
#             status_code=400,
#             detail="Please provide a valid YouTube URL, or use file upload for local files.",
#         )

#     session_id = create_session_id()

#     try:
#         result = run_pipeline(source, payload.language, session_id=session_id)
#     except Exception:
#         # Full detail is logged server-side only; the client gets a safe message.
#         logger.error("Video processing failed for source=%s\n%s", source, traceback.format_exc())
#         raise HTTPException(
#             status_code=502,
#             detail="Video processing failed. Please check the URL and try again.",
#         )

#     save_session(session_id, result["rag_chain"], title=result.get("title", ""))
#     return _to_process_response(session_id, result)


@router.post("/process-upload", response_model=ProcessResponse)
def process_upload(file: UploadFile = File(...), language: str = Form("english")):
    _, ext = os.path.splitext(file.filename or "")
    if ext.lower() not in ALLOWED_UPLOAD_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext or 'unknown'}'. "
                   f"Supported types: {', '.join(sorted(ALLOWED_UPLOAD_EXTENSIONS))}",
        )

    if language not in ("english", "hinglish"):
        raise HTTPException(status_code=400, detail="language must be 'english' or 'hinglish'.")

    session_id = create_session_id()

    # Save the upload to a temp path, then hand that path straight to the
    # EXISTING process_input()/run_pipeline() — no audio-processing logic is
    # duplicated here.
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(file.file.read())
            tmp_path = tmp.name

        result = run_pipeline(tmp_path, language, session_id=session_id)
    except Exception:
        logger.error("Upload processing failed for file=%s\n%s", file.filename, traceback.format_exc())
        raise HTTPException(
            status_code=502,
            detail="Processing this file failed. Please check the file and try again.",
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

    save_session(session_id, result["rag_chain"], title=result.get("title", ""))
    return _to_process_response(session_id, result)


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    session = get_session(payload.session_id)
    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Session not found or expired. Please process the video again.",
        )

    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    try:
        answer = ask_question(session["rag_chain"], question)
    except Exception:
        logger.error("Chat failed for session=%s\n%s", payload.session_id, traceback.format_exc())
        raise HTTPException(status_code=502, detail="Chat request failed. Please try again.")

    return ChatResponse(answer=answer)
