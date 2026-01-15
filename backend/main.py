import os
import sys

# Ensure backend is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from backend.routes.auth import router as auth_router

app = FastAPI(title="Splitify Backend V2")

app.include_router(auth_router, tags=["Auth"])
