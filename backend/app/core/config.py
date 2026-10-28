"""SAKHI AI Core Configuration."""
from pydantic import BaseModel, Field
import os
from typing import List

class Settings(BaseModel):
    app_name: str = "SAKHI AI"
    version: str = "1.0.0"
    description: str = "Interactive AI-Powered School Well-being and Safety App"
    app_env: str = os.getenv("APP_ENV", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    cors_origins: List[str] = Field(
        default_factory=lambda: [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,capacitor://localhost,http://localhost"
            ).split(",")
            if origin.strip()
        ]
    )
    
    # AI Engine settings — default to 'llm' when HF_TOKEN is set
    ai_engine_mode: str = os.getenv("AI_ENGINE_MODE", "llm")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")

    # Hugging Face / Qwen3-8B settings
    hf_token: str = os.getenv("HF_TOKEN", "")
    qwen3_model_id: str = os.getenv("QWEN3_MODEL_ID", "Qwen/Qwen3-8B")
    qwen3_max_tokens: int = int(os.getenv("QWEN3_MAX_TOKENS", "512"))
    qwen3_temperature: float = float(os.getenv("QWEN3_TEMPERATURE", "0.7"))
    
    # Safeguards
    max_message_length: int = 1500
    strict_safety_filter: bool = True
    session_timeout_minutes: int = 60

settings = Settings()
