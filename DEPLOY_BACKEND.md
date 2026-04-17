# 🚀 Backend Deployment Guide (Railway)

This guide provides the exact steps to deploy the **Brevity AI Engine** (FastAPI + Celery) to Railway.

---

## 🏗️ 1. Project Infrastructure
Railway makes it easy to add all the "moving parts" in one place.

1.  **Create a New Project**: Import your **Brevity** repository.
2.  **Add PostgreSQL**:
    - Click "New" → "Database" → **Add PostgreSQL**.
3.  **Add Redis**:
    - Click "New" → "Database" → **Add Redis**.

---

## 🌍 2. Service 1: The API (Web)
1.  **Configure Service**:
    - **Root Directory**: `backend`
    - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (Railway usually auto-detects this from the `Procfile`).
2.  **Variables**: Add the following `Variables` in the service settings:
    - `DATABASE_URL`: Click "Add Reference" and select the PostgreSQL `DATABASE_URL`.
    - `REDIS_URL`: Click "Add Reference" and select the Redis `REDIS_URL`.
    - `OPENAI_API_KEY`: Your key.
    - `HF_TOKEN`: Your HuggingFace token (for diarization).
    - `BACKEND_CORS_ORIGINS`: Your Vercel frontend URL.

---

## ⚙️ 3. Service 2: The AI Worker
Since the worker needs the same code but a different start command, we add it as a separate service in the same project.

1.  **Add Service**: 
    - Click "New" → "GitHub Repo" → Select **Brevity** again.
2.  **Configure Worker**:
    - **Root Directory**: `backend`
    - **Custom Start Command**: `celery -A app.worker.celery_app worker --loglevel=info`
3.  **Variables**:
    - Copy all variables from the **API Service** above. The worker needs exactly the same environment to process tasks.

---

## ✅ 4. Verification
Once both services are "Green":
1.  Open your **API URL** provided by Railway.
2.  If you see `{"message": "Welcome to DeepDive AI Intelligence API"}`, the backend is alive.
3.  The first time a video is processed, the backend will automatically create the database tables.

---
*Note: Ensure you have added your credit card/credits to Railway if your AI processing exceeds the free tier limits!*
