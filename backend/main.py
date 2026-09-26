from dotenv import load_dotenv

load_dotenv()

from utils.audio_processor import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import (
    extract_action_items,
    extract_key_decisions,
    extract_questions,
)
from core.video_frames import extract_video_frames
from core.visual_analyzer import analyze_video_frames
from core.rag_engine import build_rag_chain, ask_question
from core.video_sync import analyze_video_sync


def run_pipeline(source: str, session_id: str = None) -> dict:

    print("Starting Veyra AI Video Analysis...")

    # ---------------------------------------------------------
    # 1. Process input
    # ---------------------------------------------------------

    chunks = process_input(source)

    # ---------------------------------------------------------
    # 2. Audio transcription
    # ---------------------------------------------------------

    transcript = transcribe_all(chunks)

    print(
        f"Raw transcription (first 300 characters): "
        f"{transcript[:300]}"
    )

    # ---------------------------------------------------------
    # 3. Text analysis
    # ---------------------------------------------------------

    title = generate_title(transcript)
    summary = summarize(transcript)

    action_item = extract_action_items(transcript)
    decisions = extract_key_decisions(transcript)
    questions = extract_questions(transcript)

    # ---------------------------------------------------------
    # 4. Visual frame extraction
    # ---------------------------------------------------------

    print("\nExtracting visual frames...")

    visual_frames = extract_video_frames(
        source,
        interval_seconds=10,
    )

    # ---------------------------------------------------------
    # 5. Visual analysis
    # ---------------------------------------------------------

    print("\nAnalyzing visual frames...")

    visual_context = analyze_video_frames(
        visual_frames
    )

    # ---------------------------------------------------------
    # 6. Audio / video synchronization
    # ---------------------------------------------------------

    print("\nAnalyzing audio/video synchronization...")

   
    sync_result = analyze_video_sync(source)

    print(
        f"Sync result: {sync_result}"
    )

    # ---------------------------------------------------------
    # 7. Build combined RAG
    # ---------------------------------------------------------

    print("\nBuilding combined transcript + visual RAG...")

    rag_chain = build_rag_chain(
        transcript,
        visual_context=visual_context,
        collection_name=session_id,
    )

    print("Veyra pipeline complete.")

    return {
        "title": title,
        "transcript": transcript,
        "summary": summary,
        "action_items": action_item,
        "key_decisions": decisions,
        "open_questions": questions,
        "rag_chain": rag_chain,
        "sync_analysis": sync_result,
        "visual_context": visual_context,
    }


if __name__ == "__main__":

    source = input(
        "Enter local video or audio file path: "
    ).strip()

    result = run_pipeline(source)

    print("\n" + "=" * 60)

    print(
        f"Title: {result['title']}"
    )

    print(
        f"\nSummary:\n{result['summary']}"
    )

    print(
        f"\nAction Items:\n{result['action_items']}"
    )

    print(
        f"\nKey Decisions:\n{result['key_decisions']}"
    )

    print(
        f"\nOpen Questions:\n{result['open_questions']}"
    )

    print("=" * 60)

    print(
        "\nChat with your video "
        "(type 'exit' to quit)\n"
    )

    rag_chain = result["rag_chain"]

    while True:

        question = input("You: ").strip()

        if question.lower() in [
            "exit",
            "quit",
            "q",
        ]:
            print("Goodbye!")
            break

        if not question:
            continue

        answer = ask_question(
            rag_chain,
            question,
        )

        print(
            f"\nAssistant: {answer}\n"
        )


# from dotenv import load_dotenv
# load_dotenv()
# from utils.audio_processor import process_input
# from core.transcriber import transcribe_all
# from core.summarizer import summarize, generate_title
# from core.extractor import extract_action_items, extract_key_decisions, extract_questions
# from core.rag_engine import build_rag_chain, ask_question
# from core.video_sync import analyze_mouth_movement, analyze_audio_activity, estimate_sync_offset




# def run_pipeline(source: str, session_id: str = None) -> dict:
#     print("starting AI Video Assistant")

#     # Existing audio processing
#     chunks = process_input(source)

#     transcript = transcribe_all(chunks)
#     print(f"raw transcription (first 300 characters) {transcript[:300]}")

#     title = generate_title(transcript)

#     summary = summarize(transcript)

#     action_item = extract_action_items(transcript)

#     decisions = extract_key_decisions(transcript)

#     questions = extract_questions(transcript)

#     # Existing RAG
#     rag_chain = build_rag_chain(
#         transcript,
#         collection_name=session_id
#     )

#     # Audio/Video synchronization analysis
#     print("Analyzing audio/video synchronization...")

#     mouth_data = analyze_mouth_movement(source)

#     audio_data = analyze_audio_activity(source)

#     sync_result = estimate_sync_offset(
#         audio_data,
#         mouth_data
#     )

#     print(f"Sync result: {sync_result}")

#     return {
#         "title": title,
#         "transcript": transcript,
#         "summary": summary,
#         "action_items": action_item,
#         "key_decisions": decisions,
#         "open_questions": questions,
#         "rag_chain": rag_chain,

#         # New sync analysis
#         "sync_analysis": sync_result,
#     }
# if __name__ == "__main__":
#     # CLI entry point
#     source = input("Enter local video or audio file path: ").strip()
#     result = run_pipeline(source)

#     print("\n" + "=" * 60)
#     print(f" Title: {result['title']}")
#     print(f"\n Summary:\n{result['summary']}")
#     print(f"\n Action Items:\n{result['action_items']}")
#     print(f"\n Key Decisions:\n{result['key_decisions']}")
#     print(f"\n Open Questions:\n{result['open_questions']}")
#     print("=" * 60)

#     # Phase 2 — Chat with your meeting via RAG
#     print("\n Chat with your meeting (type 'exit' to quit)\n")
#     rag_chain = result["rag_chain"]
#     while True:
#         question = input("You: ").strip()
#         if question.lower() in ["exit", "quit", "q"]:
#             print("👋 Goodbye!")
#             break
#         if not question:
#             continue
#         answer = ask_question(rag_chain, question)
#         print(f"\n Assistant: {answer}\n")
