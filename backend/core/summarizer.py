import os
import json
import hashlib

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY is not set in environment / .env"
    )

client = OpenAI(api_key=OPENAI_API_KEY)


def _get_cache_path(transcript: str) -> str:

    transcript_hash = hashlib.md5(
        transcript.encode("utf-8")
    ).hexdigest()[:12]

    cache_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "cache"
    )

    os.makedirs(cache_dir, exist_ok=True)

    return os.path.join(
        cache_dir,
        f"text_analysis_{transcript_hash}.json"
    )


def _load_cache(transcript: str):

    cache_path = _get_cache_path(transcript)

    if not os.path.exists(cache_path):
        return None

    try:

        with open(
            cache_path,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        print(
            "Using cached text analysis."
        )

        return data

    except (
        json.JSONDecodeError,
        TypeError
    ):

        print(
            "Text analysis cache is invalid."
        )

        return None


def _save_cache(transcript: str, data: dict):

    cache_path = _get_cache_path(transcript)

    with open(
        cache_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"Text analysis cached at: {cache_path}"
    )


def _generate_analysis(transcript: str) -> dict:

    print("Generating title and summary...")

    title_response = client.responses.create(
        model="gpt-4.1-nano",
        input=(
            "Generate a short, clear title for this transcript. "
            "Return only the title.\n\n"
            f"{transcript}"
        )
    )

    title = title_response.output_text.strip()

    summary_response = client.responses.create(
        model="gpt-4.1-nano",
        input=(
            "Summarize the following transcript clearly and concisely. "
            "Focus only on the important information.\n\n"
            f"{transcript}"
        )
    )

    summary = summary_response.output_text.strip()

    data = {
        "title": title,
        "summary": summary
    }

    _save_cache(
        transcript,
        data
    )

    return data


def generate_title(transcript: str) -> str:

    cached = _load_cache(transcript)

    if cached and cached.get("title"):
        return cached["title"]

    return _generate_analysis(
        transcript
    )["title"]


def summarize(transcript: str) -> str:

    cached = _load_cache(transcript)

    if cached and cached.get("summary"):
        return cached["summary"]

    return _generate_analysis(
        transcript
    )["summary"]