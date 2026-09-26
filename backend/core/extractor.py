# Action Items, Decisions, Questions

import os
import json
import hashlib

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

load_dotenv()


def get_llm():
    return ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=0.4,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )


def build_chain(system_prompt: str):

    llm = get_llm()

    return (
        RunnablePassthrough()
        | RunnableLambda(lambda x: {"text": x})
        | ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}"),
        ])
        | llm
        | StrOutputParser()
    )


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
        f"extraction_{transcript_hash}.json"
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

        print("Using cached extraction results.")

        return data

    except (
        json.JSONDecodeError,
        TypeError
    ):

        print("Extraction cache is invalid.")

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
        f"Extraction results cached at: {cache_path}"
    )


def _generate_extractions(transcript: str) -> dict:

    print("Extracting action items...")

    action_chain = build_chain(
        "You are an expert meeting analyst. From the meeting transcript, "
        "extract all action items. For each provide:\n"
        "- Task description\n"
        "- Owner (who is responsible)\n"
        "- Deadline (if mentioned, else write 'Not specified')\n\n"
        "Format as a numbered list. If none found say 'No action items found.'"
    )

    action_items = action_chain.invoke(transcript)

    print("Extracting key decisions...")

    decision_chain = build_chain(
        "You are an expert meeting analyst. From the meeting transcript, "
        "extract all key decisions made. Format as a numbered list. "
        "If none found say 'No key decisions found.'"
    )

    key_decisions = decision_chain.invoke(transcript)

    print("Extracting open questions...")

    question_chain = build_chain(
        "From the meeting transcript, extract all unresolved questions "
        "or topics needing follow-up. Format as a numbered list. "
        "If none found say 'No open questions found.'"
    )

    open_questions = question_chain.invoke(transcript)

    data = {
        "action_items": action_items,
        "key_decisions": key_decisions,
        "open_questions": open_questions,
    }

    _save_cache(
        transcript,
        data
    )

    return data


def extract_action_items(transcript: str) -> str:

    cached = _load_cache(transcript)

    if cached and cached.get("action_items"):
        return cached["action_items"]

    data = _generate_extractions(transcript)

    return data["action_items"]


def extract_key_decisions(transcript: str) -> str:

    cached = _load_cache(transcript)

    if cached and cached.get("key_decisions"):
        return cached["key_decisions"]

    data = _generate_extractions(transcript)

    return data["key_decisions"]


def extract_questions(transcript: str) -> str:

    cached = _load_cache(transcript)

    if cached and cached.get("open_questions"):
        return cached["open_questions"]

    data = _generate_extractions(transcript)

    return data["open_questions"]