# DSA Sheet Platform – High Level Design (HLD)

## 1. Introduction

The DSA Sheet Platform is a scalable full-stack web application designed to help students practice Data Structures and Algorithms (DSA) problems in a structured and trackable manner.

The platform allows users to:

* Register and login securely
* Browse topic-wise DSA sheets
* Access learning resources
* Track solved problems
* Resume progress across sessions

The system is designed considering 10k–50k active users.

---

# 2. Tech Stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | React.js + Vite       |
| State Management | Redux Toolkit         |
| Backend          | Node.js + Express.js  |
| Database         | MongoDB Atlas         |
| Authentication   | JWT + Refresh Token   |
| Deployment       | AWS EC2 + Nginx + PM2 |
| Frontend Hosting | Netlify / Vercel      |
| Styling          | Tailwind CSS          |

---

# 3. System Architecture

```text
                ┌──────────────────────┐
                │      Client UI       │
                │  React + Redux App   │
                └──────────┬───────────┘
                           │ HTTPS
                           ▼
                ┌──────────────────────┐
                │      Nginx Proxy     │
                │      AWS EC2         │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Express Backend    │
                │ Node.js REST APIs    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │    MongoDB Atlas     │
                │  Managed Cloud DB    │
                └──────────────────────┘
```

---

# 4. Frontend Architecture

The frontend is developed using React.js and Vite.

## Folder Structure

```text
src/
 ├── api/
 ├── app/
 ├── components/
 ├── features/
 │    ├── auth/
 │    ├── topics/
 │    └── progress/
 ├── pages/
 └── routes/
```

## Frontend Responsibilities

* Authentication handling
* Rendering topic-wise DSA sheets
* Rendering progress state
* API communication
* Protected routes
* State management using Redux Toolkit

---

# 5. Backend Architecture

The backend follows a modular Express.js architecture.

## Folder Structure

```text
backend/
 ├── config/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── utils/
 └── scripts/
```

## Backend Responsibilities

* Authentication
* JWT validation
* Business logic
* Progress management
* Topic/problem retrieval
* Database communication

---

# 6. Authentication Flow

The platform uses JWT-based authentication.

## Login Flow

1. User submits email and password
2. Backend validates credentials
3. Access token is generated
4. Refresh token is stored securely
5. Access token is returned to frontend
6. Frontend stores access token
7. Protected APIs require Bearer token

## Security Features

* Password hashing using bcrypt
* JWT access tokens
* Refresh token support
* Protected API middleware
* Environment-based secret storage

---

# 7. Request Flow

## Example: Fetch Topics

```text
User Action
     ↓
React Component
     ↓
Redux Async Thunk
     ↓
Axios API Request
     ↓
Nginx Reverse Proxy
     ↓
Express Route
     ↓
MongoDB Query
     ↓
JSON Response
     ↓
Redux Store Update
     ↓
UI Re-render
```

---

# 8. Progress Tracking Flow

The application tracks solved problems independently using a normalized progress collection.

## Flow

1. User marks a problem as completed
2. Frontend sends PATCH request
3. Backend updates progress document
4. MongoDB stores completion state
5. On next login, progress is restored

## Benefits

* Fast lookup
* Independent scaling
* Cleaner schema design
* Easier analytics support

---

# 9. Database Design

The application uses MongoDB with normalized collections.

## Users Collection

```js
{
  _id,
  name,
  email,
  passwordHash,
  refreshToken,
  createdAt
}
```

## Topics Collection

```js
{
  _id,
  title,
  description,
  order
}
```

## Problems Collection

```js
{
  _id,
  topicId,
  title,
  difficulty,
  articleUrl,
  youtubeUrl,
  codingPlatformUrl,
  order
}
```

## User Progress Collection

```js
{
  _id,
  userId,
  problemId,
  completed,
  completedAt
}
```

---

# 10. Relationships Between Collections

| Collection              | Relationship |
| ----------------------- | ------------ |
| Topics → Problems       | One-to-Many  |
| Users → UserProgress    | One-to-Many  |
| Problems → UserProgress | One-to-Many  |

---

# 11. Indexing Strategy

Indexing is added to UserProgress to improve query performance.

---

### Problems

```text
topicId
```

Used for:

* Fast topic-based problem retrieval

---

### User Progress

Compound Index:

```text
userId + problemId
```

Used for:

* Fast progress lookup
* Prevent duplicate entries

---

# 12. API Design

## Authentication APIs

| Method | Endpoint           | Purpose       |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |
| POST   | /api/auth/logout   | Logout user   |
| POST   | /api/auth/refresh  | Refresh token |

---

## Topic APIs

| Method | Endpoint                 | Purpose            |
| ------ | ------------------------ | ------------------ |
| GET    | /api/topics              | Get all topics     |
| GET    | /api/topics/:id/problems | Get topic problems |

---

## Progress APIs

| Method | Endpoint                 | Purpose             |
| ------ | ------------------------ | ------------------- |
| GET    | /api/progress            | Fetch user progress |
| PATCH  | /api/progress/:problemId | Update progress     |

---

# 13. Scalability Considerations

The application is designed for 10k–50k active users.

## Horizontal Scalability

Backend APIs are stateless.

This allows:

* Multiple Node.js instances
* Easy load balancing
* Containerization support

---

## CDN-Based Frontend Delivery

Frontend deployment on Netlify/Vercel provides:

* CDN caching
* Faster static delivery
* Reduced backend load

---

## Database Optimization

Normalized collections reduce:

* Document duplication
* Large nested documents
* Update complexity

Indexes improve:

* Read performance
* Query efficiency

---

## Reverse Proxy Layer

Nginx provides:

* Reverse proxying
* Request routing
* SSL termination
* Load balancing support

---

## Future Redis Caching

Redis can be added for:

* Topic caching
* Session storage
* Frequently accessed APIs

---

# 14. Deployment Architecture

## Frontend

Hosted on:

* Netlify / Vercel

## Backend

Hosted on:

* AWS EC2

Managed using:

* PM2 process manager
* Nginx reverse proxy

## Database

Hosted on:

* MongoDB Atlas

---

# 15. Deployment Flow

```text
Frontend Build
      ↓
Netlify / Vercel Deployment

Backend Code
      ↓
AWS EC2
      ↓
PM2 Process Manager
      ↓
Nginx Reverse Proxy
```

---

# 16. Trade-Offs and Design Decisions

| Decision                       | Reason                                |
| ------------------------------ | ------------------------------------- |
| MongoDB                        | Flexible schema and rapid development |
| Redux Toolkit                  | Predictable state management          |
| Normalized Progress Collection | Better scalability                    |
| JWT Authentication             | Stateless scalable auth               |
| EC2 Deployment                 | Production-like infrastructure        |
| Nginx Reverse Proxy            | Better deployment architecture        |

---

# 17. Future Improvements

Possible future enhancements:

* Search and filtering
* Notes system
* Streak tracking
* Analytics dashboard
* Admin panel
* Redis caching
* WebSockets for live updates
* Kubernetes deployment
* Docker containerization
* CI/CD pipelines

---

# 18. Conclusion

The DSA Sheet Platform is designed using scalable full-stack architecture principles.

The application supports:

* Secure authentication
* Structured learning
* Persistent progress tracking
* Scalable APIs
* Production-style deployment

The architecture is suitable for medium-scale usage and can be extended further with caching, containerization, and distributed deployment strategies.
