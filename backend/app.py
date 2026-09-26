"""
Veyra FastAPI application entrypoint.
"""

import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router as api_router


load_dotenv()

logging.basicConfig(
    level=logging.INFO
)


app = FastAPI(
    title="Veyra API",
    description=(
        "API for Veyra's AI-powered audio, "
        "video, visual, synchronization, "
        "and RAG analysis pipeline."
    ),
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

PRODUCTION_ORIGIN = (
    "https://veyra-ai-video-assistant.vercel.app"
)

ENV_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    ""
)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in ENV_ORIGINS.split(",")
    if origin.strip()
]

# Always allow the production Vercel frontend.
if PRODUCTION_ORIGIN not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(
        PRODUCTION_ORIGIN
    )

# Local development
if "http://localhost:5173" not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(
        "http://localhost:5173"
    )


logging.info(
    "CORS allowed origins: %s",
    ALLOWED_ORIGINS
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API routes
# ---------------------------------------------------------

app.include_router(
    api_router
)


@app.get("/")
def root():

    return {
        "service": "Veyra API",
        "docs": "/docs",
    }