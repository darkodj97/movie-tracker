# 🎬 Movie Tracker

A full-stack movie tracking application where users can search for movies, track what they've watched, manage their watchlist, and rate movies.

## 🌐 Live Demo

- **Frontend**: https://movie-tracker-git-main-darko-s-projects2.vercel.app
- **Backend API**: https://movie-tracker-backend-acc8.onrender.com

> **Note**: The backend is hosted on Render's free tier. The first request may take up to 60 seconds as the server wakes up from sleep. Subsequent requests will be fast.

## ✨ Features

- User authentication with JWT tokens
- Search movies using TMDB API with live search
- Track watched movies and watchlist
- Rate and review movies
- Movie detail page with cast information
- Profile page with statistics and top rated movies

## 🛠️ Tech Stack

**Backend:**
- Python
- FastAPI
- PostgreSQL (Supabase)
- SQLAlchemy
- JWT Authentication
- TMDB API

**Frontend:**
- React
- TypeScript
- Tailwind CSS
- Axios
- React Router

## 🚀 Running Locally

> **Note**: To run locally, update all API URLs in `frontend/src` files from the production Render URL to `http://localhost:8000`. Also update the database URL in `backend/database.py` to your local PostgreSQL instance.

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```