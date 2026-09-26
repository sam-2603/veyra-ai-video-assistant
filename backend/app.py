"""
Veyra FastAPI application entrypoint.

This file only configures the FastAPI application,
CORS, and API routes.
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


_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in _raw_origins.split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)


@app.get("/")
def root():
    return {
        "service": "Veyra API",
        "docs": "/docs",
    }