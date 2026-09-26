import os
import json
import hashlib

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY is not set in environment / .env"
    )

openai_client = OpenAI(api_key=OPENAI_API_KEY)

OPENAI_STT_MODEL = "gpt-4o-mini-transcribe"


def transcribe_chunk(chunk_path: str) -> str:

    print(f"Transcribing with OpenAI: {chunk_path}")

    with open(chunk_path, "rb") as audio_file:

        result = openai_client.audio.transcriptions.create(
            model=OPENAI_STT_MODEL,
            file=audio_file
        )

    return result.text.strip()


def _get_cache_path(chunks: list) -> str:

    hasher = hashlib.md5()

    for chunk_path in chunks:

        with open(chunk_path, "rb") as file:

            while True:

                data = file.read(1024 * 1024)

                if not data:
                    break

                hasher.update(data)

    cache_hash = hasher.hexdigest()[:12]

    cache_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "cache"
    )

    os.makedirs(cache_dir, exist_ok=True)

    return os.path.join(
        cache_dir,
        f"transcript_{cache_hash}.json"
    )


def transcribe_all(chunks: list) -> str:

    if not chunks:
        return ""

    cache_path = _get_cache_path(chunks)

    # --------------------------------------------------
    # USE CACHE
    # --------------------------------------------------

    if os.path.exists(cache_path):

        try:

            with open(
                cache_path,
                "r",
                encoding="utf-8"
            ) as file:

                cached_data = json.load(file)

            transcript = cached_data.get("transcript")

            if transcript:

                print(
                    "Using cached transcription."
                )

                return transcript

        except (
            json.JSONDecodeError,
            KeyError,
            TypeError
        ):

            print(
                "Transcript cache is invalid. "
                "Running transcription again."
            )

    # --------------------------------------------------
    # TRANSCRIBE
    # --------------------------------------------------

    print(
        "Using OpenAI for English transcription."
    )

    transcripts = []

    for i, chunk in enumerate(chunks):

        print(
            f"Transcribing chunk "
            f"{i + 1}/{len(chunks)}..."
        )

        text = transcribe_chunk(chunk)

        if text:
            transcripts.append(text)

    transcript = " ".join(transcripts)

    # --------------------------------------------------
    # SAVE CACHE
    # --------------------------------------------------

    with open(
        cache_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            {
                "transcript": transcript
            },
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"Transcript cached at: {cache_path}"
    )

    return transcript