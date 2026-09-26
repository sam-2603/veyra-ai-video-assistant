import os
import hashlib

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_DIR = os.path.join(BASE_DIR, "vector_db")

COLLECTION_NAME = "meeting_transcript"

EMBEDDING_MODEL = "text-embedding-3-small"


def get_embeddings():

    return OpenAIEmbeddings(
        model=EMBEDDING_MODEL,
        api_key=os.getenv("OPENAI_API_KEY")
    )


def _get_collection_name(
    transcript: str,
    visual_context: list = None,
    collection_name: str = None
) -> str:

    visual_text = ""

    if visual_context:
        visual_text = "|".join(
            f"{item['timestamp']}:{item['description']}"
            for item in visual_context
        )

    cache_input = transcript + visual_text

    content_hash = hashlib.md5(
        cache_input.encode("utf-8")
    ).hexdigest()[:12]

    # Keep the user/session ID for identification,
    # but make the collection content-specific.
    if collection_name:
        return f"{collection_name}_{content_hash}"

    return f"{COLLECTION_NAME}_{content_hash}"


def build_vector_store(
    transcript: str,
    visual_context: list = None,
    collection_name: str = None
) -> Chroma:

    print("Building vector store...")

    collection = _get_collection_name(
        transcript,
        visual_context,
        collection_name
    )

    embeddings = get_embeddings()

    # ---------------------------------------------------------
    # Check whether this collection already exists
    # ---------------------------------------------------------

    vector_store = Chroma(
        collection_name=collection,
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR
    )

    existing_count = vector_store._collection.count()

    if existing_count > 0:

        print(
            f"Using cached vector store "
            f"({existing_count} documents)."
        )

        return vector_store

    documents = []

    # ---------------------------------------------------------
    # 1. Transcript
    # ---------------------------------------------------------

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    transcript_chunks = splitter.split_text(transcript)

    for i, chunk in enumerate(transcript_chunks):

        documents.append(
            Document(
                page_content=chunk,
                metadata={
                    "type": "transcript",
                    "chunk_index": i
                }
            )
        )

    print(
        f"Added {len(transcript_chunks)} transcript chunks."
    )

    # ---------------------------------------------------------
    # 2. Visual context
    # ---------------------------------------------------------

    if visual_context:

        for item in visual_context:

            timestamp = item["timestamp"]
            description = item["description"]

            visual_text = (
                f"[Visual timestamp: {timestamp}s]\n"
                f"{description}"
            )

            documents.append(
                Document(
                    page_content=visual_text,
                    metadata={
                        "type": "visual",
                        "timestamp": timestamp
                    }
                )
            )

        print(
            f"Added {len(visual_context)} visual descriptions."
        )

    # ---------------------------------------------------------
    # 3. Create embeddings
    # ---------------------------------------------------------

    vector_store.add_documents(
        documents
    )

    print(
        f"Vector store ready with "
        f"{len(documents)} documents."
    )

    return vector_store


def load_vector_store(
    collection_name: str = None
) -> Chroma:

    collection = collection_name or COLLECTION_NAME

    embeddings = get_embeddings()

    vector_store = Chroma(
        collection_name=collection,
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR
    )

    return vector_store


def get_retriever(
    vector_store: Chroma,
    k: int = 6
):

    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": k
        }
    )