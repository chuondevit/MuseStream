# MuseStream – Music Streaming Platform

**Project:** Design and Development of a Music Streaming Platform with Personalized Recommendations

## Technology
- Frontend: ReactJS + Vite
- Backend: Java Spring Boot (MVC)
- Database: PostgreSQL
- Authentication: JWT-ready structure

## Main features
- Register and login
- First-time music preference onboarding
- Browse songs and artists
- Search songs
- Personalized recommendations based on favorite genres, artists and songs
- Like songs and create playlists
- Dashboard with listening statistics

## Quick start

### Database
Create PostgreSQL database:
```sql
CREATE DATABASE musestream;
```
Then run `database/schema.sql`.

### Backend
Edit `backend/src/main/resources/application.properties` with your PostgreSQL username/password.

```bash
cd backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend normally runs at `http://localhost:5173`.

## Demo recommendation logic
The backend scores songs based on:
1. Matching preferred genres
2. Matching favorite artists
3. Matching favorite songs' genres/artists

This is intentionally transparent and suitable for a university project. You can later extend it with listening history or collaborative filtering.
