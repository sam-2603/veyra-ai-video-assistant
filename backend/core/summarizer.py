import os
import json
import hashlib
import re

from dotenv import load_dotenv
from langchain_groq import ChatGroq


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not set in environment / .env"
    )


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.2,
    groq_api_key=GROQ_API_KEY,
)


def _get_cache_path(transcript: str) -> str:

    transcript_hash = hashlib.md5(
        transcript.encode("utf-8")
    ).hexdigest()[:12]

    cache_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "cache"
    )

    os.makedirs(
        cache_dir,
        exist_ok=True
    )

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


def _save_cache(
    transcript: str,
    data: dict
):

    cache_path = _get_cache_path(
        transcript
    )

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
        f"Text analysis cached at: "
        f"{cache_path}"
    )


def _parse_response(text: str) -> dict:

    text = text.strip()

    # Remove markdown code fences if the model adds them.
    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    try:

        data = json.loads(text)

        return {
            "title": str(
                data.get("title", "")
            ).strip(),

            "summary": str(
                data.get("summary", "")
            ).strip(),
        }

    except json.JSONDecodeError:

        # Fallback if the model does not return valid JSON.
        title_match = re.search(
            r'"title"\s*:\s*"([^"]*)"',
            text,
            re.IGNORECASE
        )

        summary_match = re.search(
            r'"summary"\s*:\s*"([\s\S]*)"',
            text,
            re.IGNORECASE
        )

        return {
            "title": (
                title_match.group(1).strip()
                if title_match
                else "Video Analysis"
            ),
            "summary": (
                summary_match.group(1).strip()
                if summary_match
                else text
            ),
        }


def _generate_analysis(
    transcript: str
) -> dict:

    print(
        "Generating title and summary with Groq..."
    )

    prompt = f"""
You are an expert video and meeting analyst.

Analyze the transcript below.

Generate:
1. A short, clear title.
2. A concise summary containing only the important information.

Return ONLY valid JSON in exactly this format:

{{
  "title": "Short title",
  "summary": "Concise summary"
}}

Do not add markdown.
Do not add explanations.

Transcript:
{transcript}
"""

    response = llm.invoke(prompt)

    result = _parse_response(
        response.content
    )

    _save_cache(
        transcript,
        result
    )

    return result


def generate_title(
    transcript: str
) -> str:

    cached = _load_cache(
        transcript
    )

    if cached and cached.get("title"):

        return cached["title"]

    return _generate_analysis(
        transcript
    )["title"]


def summarize(
    transcript: str
) -> str:

    cached = _load_cache(
        transcript
    )

    if cached and cached.get("summary"):

        return cached["summary"]

    return _generate_analysis(
        transcript
    )["summary"]