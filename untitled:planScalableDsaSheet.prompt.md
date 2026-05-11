# plan.md

# Scalable DSA Sheet Platform — Revised Technical Plan

## Overview

Build a production-ready full-stack DSA Sheet platform using the existing JavaScript stack (React + Vite + Express + MongoDB). The focus is on:

- Scalable backend architecture
- Secure authentication
- Clean API design
- Normalized database schema
- Maintainable folder structure
- Production-ready deployment
- Progress tracking persistence

The goal is to demonstrate strong engineering and Technical Lead capabilities rather than building a flashy UI.

---

# Tech Stack

## Frontend

- React + Vite
- React Router DOM
- Axios
- Redux Toolkit + RTK Query (optional)
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- cookie-parser

## Security & Utilities

- helmet
- cors
- express-rate-limit
- morgan / winston
- dotenv
- express-validator / Joi

## Deployment

- Frontend: Vercel
- Backend: AWS EC2
- Database: MongoDB Atlas
- Reverse Proxy: Nginx

---

# High-Level Architecture

```text
Client (React + Vite)
        ↓
Nginx Reverse Proxy
        ↓
Express.js API Server
        ↓
MongoDB Atlas
        ↓
Redis (Future Improvement)
```

---

# Backend Architecture

## Folder Structure

```text
backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── topicController.js
│   └── progressController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validateMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Topic.js
│   ├── Problem.js
│   └── UserProgress.js
│
├── routes/
│   ├── authRoutes.js
│   ├── topicRoutes.js
│   └── progressRoutes.js
│
├── services/
│   ├── authService.js
│   └── progressService.js
│
├── seed/
│   └── seedData.js
│
├── utils/
│   ├── generateToken.js
│   └── asyncHandler.js
│
├── app.js
├── server.js
└── .env
```

---

# Authentication Design

## Authentication Flow

### Login

1. User submits email/password
2. Backend validates credentials
3. Generate:
   - Access Token (short-lived)
   - Refresh Token (long-lived)

4. Save refresh token in DB
5. Send:
   - Access token in response body
   - Refresh token as HttpOnly cookie

---

## Refresh Token Flow

```text
Access Token Expires
        ↓
Frontend Axios Interceptor Detects 401
        ↓
POST /api/auth/refresh
        ↓
New Access Token Generated
        ↓
Retry Original Request
```

---

## Security Features

- Password hashing using bcrypt
- HttpOnly refresh cookies
- JWT-based stateless auth
- Route protection middleware
- Rate limiting on auth APIs
- Helmet security headers
- CORS configuration

---

# Database Schema (Normalized Design)

## Users Collection

```js
{
  (_id, name, email, passwordHash, refreshToken, createdAt);
}
```

### Indexes

```js
email: unique;
```

---

## Topics Collection

```js
{
  (_id, title, description, order);
}
```

---

## Problems Collection

```js
{
  (_id,
    topicId,
    title,
    difficulty,
    articleUrl,
    youtubeUrl,
    codingPlatformUrl,
    order);
}
```

### Indexes

```js
topicId;
difficulty;
```

---

## UserProgress Collection

```js
{
  (_id, userId, problemId, completed, completedAt);
}
```

### Compound Index

```js
userId + problemId;
```

### Why Separate Collection?

Advantages:

- Scalable
- Avoids growing user document
- Easier analytics
- Better query performance
- Cleaner normalization

---

# API Design

## Auth APIs

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

### Refresh Access Token

```http
POST /api/auth/refresh
```

### Logout

```http
POST /api/auth/logout
```

---

## Topic APIs

### Get All Topics

```http
GET /api/topics
```

### Get Problems By Topic

```http
GET /api/topics/:id/problems?page=1&limit=20
```

---

## Progress APIs

### Get User Progress

```http
GET /api/progress
```

### Mark Problem Complete

```http
PATCH /api/progress/:problemId
```

---

# Request Validation

Use:

- express-validator OR Joi

Validate:

- Email format
- Password length
- Route params
- Required request fields

---

# Global Error Handling

Implement centralized error middleware.

```js
app.use(globalErrorHandler);
```

Benefits:

- Consistent API responses
- Cleaner controllers
- Better debugging

---

# Logging & Monitoring

## Request Logging

Use:

- morgan

OR

- winston

Benefits:

- Debugging
- Request tracing
- Monitoring

---

# Frontend Architecture

## Folder Structure

```text
src/
├── api/
│   └── axios.js
│
├── app/
│   └── store.js
│
├── components/
│   ├── Sidebar.jsx
│   ├── ProblemCard.jsx
│   └── ProtectedRoute.jsx
│
├── features/
│   ├── auth/
│   ├── topics/
│   └── progress/
│
├── hooks/
│
├── layouts/
│
├── pages/
│   ├── Login.jsx
│   └── Dashboard.jsx
│
├── routes/
│
├── utils/
│
└── main.jsx
```

---

# Frontend Features

## Login Page

- Email/password login
- Validation
- Error handling

---

## Dashboard

- Topic sidebar
- Problem list
- Difficulty badges
- Progress checkbox

---

# Progress Tracking Flow

```text
Checkbox Click
      ↓
PATCH /api/progress/:problemId
      ↓
Database Update
      ↓
Frontend State Update
```

---

# Axios Interceptor

Implement automatic refresh token handling.

## Flow

1. API request fails with 401
2. Axios interceptor calls refresh API
3. Receive new access token
4. Retry original request

Benefits:

- Seamless user experience
- Persistent sessions
- Production-level auth flow

---

# UI Features

## Core Features

- Topic-wise DSA structure
- Difficulty indicators
- Learning resource links
- Persistent progress tracking

---

## Optional Features

- Search
- Filter by difficulty
- Progress percentage
- Dark mode
- Topic completion percentage

---

# Seed Data

Create:

```text
seed/seedData.js
```

Preload:

- Arrays
- Strings
- Linked Lists
- Trees
- Graphs
- Dynamic Programming

Purpose:

- Faster testing
- Better demo experience

---

# Scalability Considerations

## Horizontal Scaling

```text
Load Balancer
      ↓
Multiple Express Instances
```

Benefits:

- Better concurrency handling
- Improved reliability

---

# Stateless Backend

JWT-based authentication allows:

- Easy horizontal scaling
- No server-side session dependency

---

# Database Optimization

Use:

- Proper indexing
- Pagination
- Lean queries
- Projection

---

# Caching Strategy (Future Scope)

Redis can cache:

- Topics
- Problems
- Frequently accessed metadata

Benefits:

- Faster reads
- Reduced DB load

---

# Deployment Strategy

## Frontend Deployment

- Vercel

---

## Backend Deployment

- AWS EC2
- PM2 process manager
- Nginx reverse proxy

---

## Database

- MongoDB Atlas

---

# Environment Variables

## Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
REFRESH_SECRET=
CLIENT_URL=
```

## Frontend

```env
VITE_API_URL=
```

---

# Verification Checklist

## Backend Verification

- Test auth APIs using Postman
- Verify JWT generation
- Verify refresh flow
- Verify protected routes

---

## Database Verification

- Confirm collections
- Confirm indexes
- Confirm progress persistence

---

## Frontend Verification

- Login works
- Protected routes work
- Topics load properly
- Progress updates correctly

---

# Tradeoffs & Design Decisions

## Why MongoDB?

Advantages:

- Flexible schema
- Fast development
- Easy nested structures

Tradeoff:

- Complex joins harder than SQL

---

## Why Separate Progress Collection?

Advantages:

- Scalable
- Cleaner normalization
- Better query performance

Tradeoff:

- Requires joins/population

---

## Why React + Vite Instead of Next.js?

Advantages:

- Faster development
- Existing familiarity
- Simpler deployment

Tradeoff:

- No SSR/SEO benefits

---

# Future Improvements

- Redis caching
- CI/CD pipeline
- Dockerization
- Role-based access
- Leaderboard system
- Analytics dashboard
- WebSockets for live updates

---

# Deliverables

- Complete source code
- AWS deployment link
- System design document
- Database schema explanation
- Short demo video (2–5 mins)

---

# Final Goal

Build a clean, scalable, production-style engineering solution that demonstrates:

- System design understanding
- Backend architecture knowledge
- Secure authentication
- Scalable database modeling
- Deployment awareness
- Technical leadership thinking
