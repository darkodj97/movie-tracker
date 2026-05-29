from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import users, movies

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(movies.router)

@app.get("/")
def root():
    return {"message": "Movie Tracker API is running!"}