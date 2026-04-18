from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base_class import Base
from app.core.sockets import manager

# Note: In a production app, use Alembic migrations. 
# For this MVP, we create tables on startup if they don't exist.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: int):
    await manager.connect(session_id, websocket)
    try:
        while True:
            # Keep the connection open
            data = await websocket.receive_text()
            # We don't really expect messages from client for now
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(session_id, websocket)

@app.get("/")
async def root():
    return {"message": "Welcome to DeepDive AI Intelligence API - Lightweight Mode"}
