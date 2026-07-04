# Airbnc

A full-stack Airbnb clone — browse listed places ("ghar"), view photos and perks, register/log in, list your own place with photo uploads, and book stays with date-range selection.

**Live app:** https://ems-2-pi.vercel.app
**Live API:** https://ems-2-v9qq.onrender.com

## Features

- User registration & login with JWT auth stored in an HTTP-only cookie, passwords hashed with bcrypt
- Create/edit/delete place listings (title, address, description, perks, check-in/out times, max guests, price)
- Photo uploads — either by direct upload (`multer`) or by pasting an image URL (server downloads it)
- Browse all places, view a single place's gallery and details
- Book a place for a date range and see your bookings
- "My places" view for hosts to manage their own listings

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19 + Vite, React Router, Tailwind CSS, Axios, date-fns |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) — `User`, `Place`, `Booking` collections |
| Auth | JWT (jsonwebtoken) + HTTP-only cookies, bcryptjs password hashing |

## Project Structure

```
/client    React + Vite frontend
/api       Express backend — routes for auth, places, bookings, photo upload
```

---

## Setup

### 1. MongoDB

Create a MongoDB database — either locally or a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. Backend environment variables

```bash
cp api/.env.example api/.env
```

Edit `api/.env`:

```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

### 3. Install dependencies

```bash
# Backend
cd api
npm install

# Frontend
cd ../client
npm install
```

---

## Running the App

**Terminal 1 — API:**
```bash
cd api
node index.js
# or, with auto-restart:
npx nodemon index.js
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
```

Then open the URL Vite prints (typically [http://localhost:5173](http://localhost:5173)).

> Note: `client/src/App.jsx` currently points `axios.defaults.baseURL` at the deployed Render API (`https://ems-2-v9qq.onrender.com`). For local development against your own backend, change this to `http://localhost:<api-port>`.

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | `/register`, `/login`, `/logout` | Auth |
| GET | `/profile` | Current logged-in user |
| POST | `/upload-by-link`, `/upload` | Photo upload (URL or file) |
| POST/PUT/GET | `/places`, `/places/:id`, `/user-places` | Manage place listings |
| DELETE | `/remove-photo` | Remove an uploaded photo |
| POST/GET | `/bookings`, `/bookings/:id` | Create & view bookings |

---

## ⚠️ Security Note

An earlier commit in this repo's history included a real MongoDB connection string and JWT secret in `api/.env`. That file has been removed from tracking and replaced with `api/.env.example`, and `api/.env` is now gitignored — but **rotate both the database password and JWT secret** if you haven't already, since the old values remain visible in the git history.
