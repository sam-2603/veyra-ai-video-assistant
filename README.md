# AI Video Assistant

A full-stack app around your existing AI Video Assistant / Video RAG pipeline:
React frontend + a thin FastAPI layer that calls your existing backend
functions (`transcribe_all`, `summarize`, `generate_title`,
`extract_action_items`, `extract_key_decisions`, `extract_questions`,
`build_rag_chain`, `ask_question`) preserved, while `process_input()` now
accepts local audio/video files only.
```
Video-Project-Rag/
├── backend/
│   ├── api/
│   │   ├── routes.py        # GET /api/health, POST /api/process-upload, /api/chat
│   │   ├── schemas.py        # Pydantic request/response models
│   │   └── session_store.py  # in-memory session_id -> rag_chain map
│   ├── core/                 # UNCHANGED except two additive optional params (see "What was changed")
│   │   ├── extractor.py
│   │   ├── rag_engine.py
│   │   ├── summarizer.py
│   │   ├── transcriber.py
│   │   └── vector_store.py
│   ├── utils/
│   │   └── audio_processor.py   # local audio/video processing
│   ├── downloads/                # temporary audio files (gitignored)
│   ├── vector_db/                 # Chroma persistence (gitignored)
│   ├── main.py                # your existing pipeline + CLI, unchanged except one optional kwarg
│   ├── app.py                 # NEW — FastAPI app, CORS, includes api/routes.py
│   ├── requirements.txt       # FastAPI/uvicorn/python-multipart and audio processing dependencies
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         # Header, VideoInput, ProcessingState, SummaryCard,
│   │   │                       # ActionItems, Decisions, Questions, Transcript, Chat
│   │   ├── pages/               # Home.jsx, Results.jsx
│   │   ├── services/api.js      # all fetch calls, centralized
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── render.yaml
```

## What was changed in your existing backend, and why

1. **`core/vector_store.py`, `core/rag_engine.py`** — added an *optional*
   `collection_name` parameter (default `None`, which preserves the exact
   original behavior) to `build_vector_store`, `load_vector_store`, and
   `build_rag_chain`. Without this, every processed video would share one
   Chroma collection, so a second user's chat could retrieve chunks from a
   different video. The API layer passes each session's own id as the
   collection name so sessions stay isolated.
2. **`main.py`** — `run_pipeline()` gained one optional kwarg,
   `session_id=None`, forwarded to `build_rag_chain`. The CLI entry point
    (`python main.py`) never passes it, so the existing CLI pipeline behavior
    remains unchanged apart from the local-file-only input change. This was necessary because `run_pipeline` is the one
   function both the CLI and the API call.

No function was renamed, removed, or reimplemented. `rag_chain` never leaves
the backend — `/api/process-upload` returns a `session_id`; `/api/chat` looks up the
in-memory session and calls your existing `ask_question(rag_chain, question)`.

**Known quirk carried over from your original code (not changed):**

`audio_processor.py` and `vector_store.py` hardcode `./backend/downloads` and
`./backend/vector_db`. Since imports (`from core...`, `from utils...`) require
Python to run with `backend/` as the working directory, these paths resolve
to a nested `backend/backend/downloads` and `backend/backend/vector_db` at
runtime. This is harmless (the folders are created automatically) but worth
knowing if you go looking for temporary audio files.

**Session storage limitation (MVP, by design):** sessions live in a
process-local Python dict. Restarting/redeploying the backend, or running
multiple `uvicorn` workers/instances, will lose or fail to find sessions
created on a different process. For production, multi-instance scale, the
transcript + a persistent per-session vector collection id would need to live
in a shared database/cache, with the chain rebuilt or reloaded (via the
existing `load_rag_chain`) per request instead of held in memory.

## Local setup

### Backend

```bash
cd Video-Project-Rag/backend

# create/activate your virtual environment (use your existing one if you have it)
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# then edit .env and fill in GROQ_API_KEY (required) and SARVAM_API_KEY (required only for Hinglish)

uvicorn app:app --reload --port 8000
```

FFmpeg must be installed on your system separately (required by `pydub`
for audio/video conversion) — e.g. `brew install ffmpeg` on macOS, `apt install ffmpeg` on
Debian/Ubuntu, or use the provided Dockerfile which installs it for you.

Confirm it's running: open `http://localhost:8000/api/health` — you should
see `{"status": "ok"}`. Interactive API docs are at `http://localhost:8000/docs`.

### Frontend

In a second terminal:

```bash
cd Video-Project-Rag/frontend
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## End-to-end test

1. Start the backend (`uvicorn app:app --reload --port 8000`).
2. Start the frontend (`npm run dev`).
3. Open `http://localhost:5173`.
4. Click "Upload file" and choose a local audio/video file.
5. Select English or Hinglish.
6. Click **Analyze Video**.
7. Watch the processing screen cycle through stages (this can take a few
   minutes — Whisper/Sarvam transcription and LLM calls are not instant).
8. On the results screen, check the **Overview** tab: title, summary, action
   items, key decisions, and open questions should all be populated.
9. Check the **Transcript** tab for the full text.
10. Open the **AI Chat** tab, type a question (e.g. "What were the main
    decisions?"), press Enter.
11. Confirm the request hits `POST /api/chat` (visible in your backend logs —
    you'll see the `Question :` / `answer :` prints from the existing
    `ask_question()`), and the answer renders in the chat.
12. Ask a second, different question and confirm the answer still reflects
    the same video's content (proving the same `session_id`/RAG session is
    reused, not rebuilt).
13. Click **Home** in the header, then try uploading an unsupported file
    type to confirm the friendly client-side and server-side error
    messages appear instead of a raw stack trace.

## Deploying to Render

`render.yaml` at the repo root defines two services:

- **ai-video-assistant-backend** — Docker web service built from
  `backend/Dockerfile` (installs FFmpeg + Python deps). Set `GROQ_API_KEY`
  and `SARVAM_API_KEY` as secret env vars in the Render dashboard (marked
  `sync: false` in the blueprint, so Render will prompt you for them).
- **ai-video-assistant-frontend** — static site built from `frontend/`,
  `VITE_API_URL` pointed at the backend service's Render URL.

After the backend service is live, update `ALLOWED_ORIGINS` on the backend
and `VITE_API_URL` on the frontend to match your actual `*.onrender.com`
URLs (the blueprint uses the default naming as a placeholder).

Notes carried over from your original requirements:
- Whisper model downloads happen at first run and need reasonable CPU/RAM —
  size your Render instance accordingly, or set `WHISPER_MODEL=tiny`/`base`
  for a lighter footprint.
- Render's filesystem is ephemeral — downloaded/converted audio in
  `downloads/` and the Chroma DB in `vector_db/` will not survive a restart.
  This is fine for the MVP's per-session flow (each session builds its own
  vector collection fresh), but is not a place to store anything you need
  to persist long-term.
