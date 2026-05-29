from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    movies = relationship("Movie", back_populates="user")


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tmdb_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    poster_url = Column(String, nullable=True)
    overview = Column(Text, nullable=True)
    release_year = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    comment = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="watched")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="movies")