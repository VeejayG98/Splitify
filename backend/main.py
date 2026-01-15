from fastapi import FastAPI
from backend.routes.auth import router as auth_router
from backend.routes.social import router as social_router

app = FastAPI()

app.include_router(auth_router, tags=["Auth"])
app.include_router(social_router, tags=["Social"])
