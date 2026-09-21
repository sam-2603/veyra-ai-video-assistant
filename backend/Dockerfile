# Backend image for the AI Video Assistant API.
FROM python:3.11-slim

# System dependencies
# FFmpeg is required for audio/video processing with pydub.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# # Install Deno
# RUN curl -fsSL https://deno.land/install.sh | sh

# # Make Deno available system-wide
# ENV PATH="/root/.deno/bin:${PATH}"

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY . .

# Render provides PORT, but keep 10000 as fallback/default
ENV PORT=10000

EXPOSE 10000

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]