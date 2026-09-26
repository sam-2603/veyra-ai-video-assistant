# Veyra Backend
FROM python:3.11-slim

# System dependencies
# FFmpeg is required for audio/video processing.
# EGL/OpenGL/GLib libraries are required by MediaPipe.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    ca-certificates \
    libegl1 \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY . .

# Render provides PORT
ENV PORT=10000

EXPOSE 10000

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]