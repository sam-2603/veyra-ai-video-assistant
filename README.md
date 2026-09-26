````markdown
# Veyra — AI Video Intelligence Assistant

Veyra is an AI-powered video analysis application that combines speech understanding, visual analysis, audio-video synchronization analysis, and RAG-based question answering into a single system.

The application allows users to upload an audio or video file and receive:

- Automatic English transcription
- AI-generated title and summary
- Action items
- Key decisions
- Open questions
- Visual analysis of video frames
- Audio-video synchronization analysis
- Context-aware chat with the processed video

---

# Features

## 🎙️ Speech Analysis

- Extract audio from uploaded media
- Transcribe spoken content using OpenAI
- Generate an English transcript
- Cache completed transcriptions to avoid repeated API usage

## 🧠 Text Intelligence

Veyra analyzes the transcript to generate:

- Title
- Summary
- Action items
- Key decisions
- Open questions

Text-analysis results are cached locally.

## 👁️ Visual Analysis

Veyra samples frames from the uploaded video and analyzes their visual content.

The visual pipeline includes:

```text
Video
  ↓
OpenCV
  ↓
Frame Sampling
  ↓
OpenAI Vision Analysis
  ↓
Visual Context
````

Visual descriptions are added to the RAG system so users can ask questions about what happens visually in the video.

## 🔊 Audio-Video Synchronization

The system estimates whether speech audio and visible mouth movement are temporally aligned.

The synchronization pipeline includes:

```text
Video
  ↓
MediaPipe Face Landmarker
  ↓
Mouth Movement Detection
  ↓
Mouth Activity Timeline


Audio
  ↓
FFmpeg
  ↓
16 kHz Mono PCM
  ↓
WebRTC VAD
  ↓
Speech Activity Timeline


Mouth Activity
       +
Speech Activity
       ↓
Temporal Alignment
       ↓
Correlation Analysis
       ↓
Estimated Sync Offset
```

Example:

```json
{
  "estimated_offset_seconds": 0.1,
  "correlation": 0.1576
}
```

The synchronization result is an experimental estimate rather than professional broadcast-grade lip-sync measurement.

## 💬 Video Question Answering

After processing, users can ask questions about the uploaded media.

Veyra uses:

* Transcript context
* Visual context
* Vector embeddings
* ChromaDB
* Retrieval-Augmented Generation
* Groq LLM

Example questions:

```text
What was discussed in the video?

What decisions were made?

What action items were mentioned?

What is visible around the middle of the video?

How many people are visible?

What is the speaker doing?
```

---

# System Architecture

```text
                    USER
                      │
                      ▼
               React Frontend
                      │
                      ▼
                FastAPI Backend
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     Audio/Video             Visual Analysis
      Processing                  │
          │                       ▼
          ▼                 Frame Sampling
    Transcription                 │
          │                       ▼
          ▼                Vision Analysis
   Text Intelligence              │
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
              Combined Context
                      │
                      ▼
                ChromaDB RAG
                      │
                      ▼
                 Groq LLM
                      │
                      ▼
                 Chat Answer
```

The synchronization analyzer operates alongside the main analysis pipeline:

```text
                 Uploaded Media
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Video                Audio
             │                   │
             ▼                   ▼
      Mouth Movement       Speech Activity
             │                   │
             └─────────┬─────────┘
                       ▼
                Correlation
                       │
                       ▼
                Sync Analysis
```

---

# Technology Stack

## Backend

* Python
* FastAPI
* Uvicorn

## AI / LLM

* OpenAI
* Groq
* OpenAI Embeddings

## Speech

* OpenAI Speech-to-Text

## Computer Vision

* OpenCV
* MediaPipe Face Landmarker

## Audio Processing

* FFmpeg
* librosa
* WebRTC VAD
* NumPy

## RAG

* LangChain
* ChromaDB
* OpenAI Embeddings

## Frontend

* React
* Vite
* JavaScript

## Deployment

* Docker
* Render

---

# Project Structure

```text
AI-Video-Assistant-Sync/
│
├── backend/
│   │
│   ├── api/
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── session_store.py
│   │
│   ├── core/
│   │   ├── extractor.py
│   │   ├── rag_engine.py
│   │   ├── summarizer.py
│   │   ├── transcriber.py
│   │   ├── vector_store.py
│   │   ├── video_frames.py
│   │   ├── video_sync.py
│   │   └── visual_analyzer.py
│   │
│   ├── utils/
│   │
│   ├── cache/
│   │
│   ├── vector_db/
│   │
│   ├── app.py
│   ├── main.py
│   ├── face_landmarker.task
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── render.yaml
└── README.md
```

---

# Requirements

Before running Veyra locally, install:

* Python 3.11+
* Node.js
* FFmpeg
* Git

The project has been developed and tested with Python 3.14 as well.

---

# FFmpeg Installation

FFmpeg is required for audio extraction and media processing.

Verify the installation:

```bash
ffmpeg -version
```

The command should display the installed FFmpeg version.

---

# Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file inside the `backend` directory.

Required API keys:

```text
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
```

Never commit `.env` or API keys to GitHub.

---

# Run the Backend

From the `backend` directory:

```bash
uvicorn app:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# Processing Pipeline

When a user uploads a video, Veyra performs the following operations:

```text
User Upload
     ↓
FastAPI
     ↓
Media Processing
     ↓
┌─────────────────────────────────────┐
│                                     │
│  Audio Processing                   │
│       ↓                             │
│  OpenAI Transcription               │
│       ↓                             │
│  Transcript                         │
│                                     │
│  Video Processing                   │
│       ↓                             │
│  Frame Extraction                   │
│       ↓                             │
│  Visual Analysis                    │
│                                     │
│  Synchronization Analysis            │
│       ↓                             │
│  Mouth + Speech Activity             │
│       ↓                             │
│  Sync Offset                        │
│                                     │
└─────────────────────────────────────┘
     ↓
Text + Visual Context
     ↓
Embeddings
     ↓
ChromaDB
     ↓
RAG
     ↓
Groq LLM
     ↓
User Chat
```

---

# Caching

Veyra uses local caching to reduce unnecessary API calls and processing.

Cached components include:

* Transcription
* Text analysis
* Action items
* Key decisions
* Open questions
* Visual analysis
* Synchronization analysis
* Vector database collections

This allows previously processed media to reuse existing results instead of repeating expensive operations.

---

# Visual Analysis

Video frames are sampled at regular intervals.

The current pipeline uses:

```text
Frame interval: 10 seconds
Vision model: gpt-4.1-nano
Image detail: low
```

The extracted descriptions are stored as visual context and included in the RAG vector store.

---

# Synchronization Analysis

The synchronization analyzer currently uses:

```text
Video sampling rate: 5 FPS

Audio sampling rate: 16 kHz

VAD frame duration: 30 ms

Maximum tested sync offset: ±2 seconds
```

The implementation is located at:

```text
backend/core/video_sync.py
```

---

# Sync Result Interpretation

### Estimated Offset

The estimated offset represents the temporal shift where the audio and mouth activity signals show their strongest alignment.

Example:

```text
+0.10 seconds
```

This indicates an estimated 0.10-second temporal shift between the detected activity signals.

### Correlation

Correlation represents the measured relationship between the audio activity and mouth movement signals.

A stronger correlation indicates a stronger temporal relationship between the two detected activity patterns.

The result should be treated as an experimental synchronization estimate.

---

# Supported Media

The application supports common audio and video formats, including:

```text
MP4
MOV
MKV
AVI
WEBM
MP3
WAV
M4A
AAC
FLAC
```

Actual compatibility depends on the codecs contained in the media file and the installed FFmpeg build.

---

# Limitations

## Synchronization Accuracy

The synchronization system is experimental and does not currently provide professional frame-accurate broadcast lip-sync measurement.

## Multiple Speakers

The current implementation primarily analyzes a single detected face.

Multiple speakers may reduce the reliability of mouth movement analysis.

## Face Visibility

Mouth analysis can become unreliable when:

* The face is not visible
* The person is facing away
* The face is partially blocked
* Lighting is poor
* Video quality is low

## Background Noise

Audio activity detection can be affected by:

* Background noise
* Music
* Non-speech sounds
* Other audio activity

## Processing Time

Long videos require more processing because the system performs:

* Audio processing
* Transcription
* Frame extraction
* Visual analysis
* Synchronization analysis
* Embedding generation

---

# Future Improvements

Possible future improvements include:

* Multi-face speaker tracking
* Speaker-specific visual analysis
* Better mouth-opening measurements
* Improved speech activity detection
* Audio-visual feature extraction
* Frame-level synchronization analysis
* Audio and mouth activity visualization
* Synchronization confidence scoring
* Variable synchronization drift detection
* GPU acceleration
* Background processing for long videos
* Persistent visual-analysis caching
* Improved speaker identification

---

# Example Workflow

```text
User uploads media
        ↓
FastAPI receives file
        ↓
Audio extraction
        ↓
English transcription
        ↓
Text analysis
        ↓
Video frame extraction
        ↓
Visual analysis
        ↓
Audio/video synchronization analysis
        ↓
Combined transcript + visual context
        ↓
ChromaDB
        ↓
RAG
        ↓
User asks a question
        ↓
Relevant context retrieved
        ↓
Groq LLM
        ↓
Answer displayed in Veyra
```

---

# Project Goal

The goal of Veyra is to build a practical AI system capable of understanding both the **spoken** and **visual** content of video while also analyzing the relationship between audio and visible mouth movement.

The project combines:

```text
Speech Understanding
        +
Computer Vision
        +
Audio Processing
        +
Audio/Video Synchronization
        +
Vector Search
        +
RAG
        +
LLMs
        ↓
Veyra
```

---

# License

This project is intended for educational, experimental, and research purposes.

```

