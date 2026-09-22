from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import analysis, ai

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Academic Dependency Analyzer API",
    description="Linear Algebra & Vector Calculus analysis backend for student academic performance.",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "app": "Student Academic",
        "description": "Linear Algebra & Vector Calculus",
        "status": "online",
        "docs_url": "/docs",
    }
