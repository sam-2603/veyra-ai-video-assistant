import logging
import os
import subprocess
import tempfile
import traceback

from fastapi import APIRouter, HTTPException, UploadFile, File

from main import run_pipeline
from core.rag_engine import ask_question
from api.schemas import (
    ProcessResponse,
    ChatRequest,
    ChatResponse,
    HealthResponse,
)
from api.session_store import (
    create_session_id,
    save_session,
    get_session,
)

logger = logging.getLogger("api")

router = APIRouter(prefix="/api")

ALLOWED_UPLOAD_EXTENSIONS = {
    ".mp4", ".mov", ".mkv", ".avi", ".webm",
    ".mp3", ".wav", ".m4a", ".aac", ".flac",
}

MAX_VIDEO_DURATION_SECONDS = 5 * 60


def _get_media_duration(file_path: str) -> float:
    """
    Get media duration in seconds using ffprobe.
    """

    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            file_path,
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    return float(result.stdout.strip())


def _to_process_response(
    session_id: str,
    result: dict
) -> ProcessResponse:

    return ProcessResponse(
        session_id=session_id,
        title=result["title"],
        summary=result["summary"],
        transcript=result["transcript"],
        action_items=result["action_items"],
        key_decisions=result["key_decisions"],
        open_questions=result["open_questions"],
        sync_analysis=result["sync_analysis"],
    )


@router.get(
    "/health",
    response_model=HealthResponse
)
def health():

    return HealthResponse(
        status="ok"
    )


@router.post(
    "/process-upload",
    response_model=ProcessResponse
)
def process_upload(
    file: UploadFile = File(...)
):

    _, ext = os.path.splitext(
        file.filename or ""
    )

    if ext.lower() not in ALLOWED_UPLOAD_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type "
                f"'{ext or 'unknown'}'. "
                f"Supported types: "
                f"{', '.join(sorted(ALLOWED_UPLOAD_EXTENSIONS))}"
            ),
        )

    session_id = create_session_id()

    tmp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=ext
        ) as tmp:

            tmp.write(
                file.file.read()
            )

            tmp_path = tmp.name

        # Check duration before any AI processing.
        try:

            duration = _get_media_duration(
                tmp_path
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not determine the "
                    "media duration. Please upload "
                    "a valid audio or video file."
                ),
            )

        if duration > MAX_VIDEO_DURATION_SECONDS:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Video is too long. "
                    "Maximum allowed duration is "
                    "5 minutes."
                ),
            )

        logger.info(
            "Accepted media duration: %.2f seconds",
            duration
        )

        # English-only processing.
        result = run_pipeline(
            tmp_path,
            session_id=session_id
        )

    except HTTPException:

        raise

    except Exception:

        logger.error(
            "Upload processing failed for "
            "file=%s\n%s",
            file.filename,
            traceback.format_exc()
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Processing this file failed. "
                "Please check the file and try again."
            ),
        )

    finally:

        if (
            tmp_path
            and os.path.exists(tmp_path)
        ):

            os.remove(tmp_path)

    save_session(
        session_id,
        result["rag_chain"],
        title=result.get(
            "title",
            ""
        )
    )

    return _to_process_response(
        session_id,
        result
    )


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    payload: ChatRequest
):

    session = get_session(
        payload.session_id
    )

    if session is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Session not found or expired. "
                "Please process the video again."
            ),
        )

    question = payload.question.strip()

    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question must not be empty."
        )

    try:

        answer = ask_question(
            session["rag_chain"],
            question
        )

    except Exception:

        logger.error(
            "Chat failed for session=%s\n%s",
            payload.session_id,
            traceback.format_exc()
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Chat request failed. "
                "Please try again."
            ),
        )

    return ChatResponse(
        answer=answer
    )