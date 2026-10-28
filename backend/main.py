"""Root entrypoint for deployment (Vercel / ASGI)."""
from app.main import app

__all__ = ["app"]
