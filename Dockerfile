# --- ROOT LEVEL DOCKERFILE FOR RAILWAY BACKEND ---
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
# ffmpeg is CRITICAL for yt-dlp and Whisper audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first to leverage Docker cache
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the backend directory into the current workdir
COPY backend/ .

# Ensure the app is in the Python path
ENV PYTHONPATH=/app

# Railway/Render usually provide a $PORT environment variable
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
