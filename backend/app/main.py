"""Main FastAPI application entry point for SAKHI AI."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys

from app.core.config import settings
from app.api.routes import api_router

# Configure minimal privacy-respecting logger (no request payload dumps)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] SAKHI-AI: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("sakhi_ai")

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Interactive AI-Powered School Well-being and Safety Application for Students",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Privacy protection middleware: logs method and path, never body or session data
@app.middleware("http")
async def privacy_auditing_middleware(request: Request, call_next):
    # Log path without sensitive query or body parameters
    path = request.url.path
    if path.startswith("/api"):
        logger.info(f"Incoming request: {request.method} {path}")
    response = await call_next(request)
    return response

# Mount routes
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "tagline": "Your Voice. Your Safety. Your Space.",
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
