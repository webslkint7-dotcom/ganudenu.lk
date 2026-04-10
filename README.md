# Classifieds Platform (MERN, JWT, Tailwind, Vite)

## Overview
A full-stack classifieds platform with authentication using the MERN stack (MongoDB, Express, React, Node.js), JWT for authentication, TailwindCSS for styling, and React with Vite for the frontend.

## Features
- User registration and login (JWT authentication)
- Secure backend API (Express, MongoDB)
- Modern React frontend (Vite, TailwindCSS)
- Responsive, clean UI

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file (see `.env.example`)
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Folder Structure
- `backend/` — Node.js/Express API
- `frontend/` — React (Vite) app

---

Replace this README as you build out your project.

## Deploy On Vercel (Frontend + Backend)

This repository is configured to deploy both apps in one Vercel project:
- Frontend build source: `frontend/`
- Backend API source: `backend/`
- API routes served from: `/api/*`

### 1. Push this repository to GitHub
Make sure the latest code is pushed.

### 2. Import the repository in Vercel
1. Open Vercel dashboard.
2. Click **Add New Project**.
3. Import this GitHub repo.
4. Keep the **Root Directory** as repository root (where `vercel.json` exists).

### 3. Configure environment variables in Vercel
Add these in **Project Settings -> Environment Variables**:
- `MONGO_URI` = your MongoDB Atlas URI (recommended for production)
- `LOCAL_MONGO_URI` = optional fallback local URI (usually not needed in Vercel)
- `JWT_SECRET` = strong random secret
- `FRONTEND_URL` = your deployed frontend URL (for CORS), for example `https://your-project.vercel.app`
- `VITE_API_URL` = `/api`

### 4. Deploy
Trigger deploy from Vercel UI.

### 5. Verify
- Frontend should open at your Vercel domain.
- API health check: `https://your-project.vercel.app/api/health`

## Local Development Notes

- Frontend defaults to `http://localhost:5000/api` in development mode.
- Production defaults to `/api`, so frontend and backend work on the same Vercel domain.
