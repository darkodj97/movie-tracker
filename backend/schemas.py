from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    def username_min_length(cls, v):
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v

    @field_validator("password")
    def password_min_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class MovieCreate(BaseModel):
    tmdb_id: int
    title: str
    poster_url: Optional[str] = None
    overview: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    rating: Optional[float] = None
    comment: Optional[str] = None
    status: str = "watched"

class MovieUpdate(BaseModel):
    rating: Optional[float] = None
    comment: Optional[str] = None
    status: Optional[str] = None

class MovieResponse(BaseModel):
    id: int
    user_id: int
    tmdb_id: int
    title: str
    poster_url: Optional[str] = None
    overview: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    rating: Optional[float] = None
    comment: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True