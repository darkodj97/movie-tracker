from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from typing import List
import models
import schemas
import auth
import httpx

TMDB_API_KEY = "5502ad0c5d587a35648dc5d52b1f4c52"
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500"
TMDB_PROFILE_URL = "https://image.tmdb.org/t/p/w185"

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/search")
async def search_movies(query: str, current_user: models.User = Depends(auth.get_current_user)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/movie",
            params={"api_key": TMDB_API_KEY, "query": query, "language": "en-US"}
        )
        data = response.json()
        results = []
        for movie in data.get("results", [])[:10]:
            results.append({
                "tmdb_id": movie["id"],
                "title": movie["title"],
                "poster_url": f"{TMDB_IMAGE_URL}{movie['poster_path']}" if movie.get("poster_path") else None,
                "overview": movie.get("overview"),
                "release_year": int(movie["release_date"][:4]) if movie.get("release_date") else None,
            })
        return results

@router.get("/cast/{tmdb_id}")
async def get_cast(tmdb_id: int, current_user: models.User = Depends(auth.get_current_user)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/{tmdb_id}/credits",
            params={"api_key": TMDB_API_KEY}
        )
        data = response.json()
        cast = []
        for member in data.get("cast", [])[:10]:
            cast.append({
                "name": member["name"],
                "character": member.get("character"),
                "profile_url": f"{TMDB_PROFILE_URL}{member['profile_path']}" if member.get("profile_path") else None,
            })
        return cast

@router.post("/", response_model=schemas.MovieResponse)
def add_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    existing = db.query(models.Movie).filter(
        models.Movie.user_id == current_user.id,
        models.Movie.tmdb_id == movie.tmdb_id,
        models.Movie.status == movie.status
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Movie already in your list")

    db_movie = models.Movie(
        user_id=current_user.id,
        **movie.model_dump()
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.get("/", response_model=List[schemas.MovieResponse])
def get_my_movies(
    status: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Movie).filter(models.Movie.user_id == current_user.id)
    if status:
        query = query.filter(models.Movie.status == status)
    return query.order_by(models.Movie.created_at.desc()).all()

@router.put("/{movie_id}", response_model=schemas.MovieResponse)
def update_movie(
    movie_id: int,
    movie_update: schemas.MovieUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    movie = db.query(models.Movie).filter(
        models.Movie.id == movie_id,
        models.Movie.user_id == current_user.id
    ).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    for key, value in movie_update.model_dump(exclude_unset=True).items():
        setattr(movie, key, value)

    db.commit()
    db.refresh(movie)
    return movie

@router.delete("/{movie_id}")
def delete_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    movie = db.query(models.Movie).filter(
        models.Movie.id == movie_id,
        models.Movie.user_id == current_user.id
    ).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    db.delete(movie)
    db.commit()
    return {"message": "Movie deleted"}

@router.get("/{movie_id}", response_model=schemas.MovieResponse)
def get_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    movie = db.query(models.Movie).filter(
        models.Movie.id == movie_id,
        models.Movie.user_id == current_user.id
    ).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie