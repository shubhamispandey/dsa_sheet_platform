# Architecture Document

## System Overview

The DSA Sheet Platform is a full-stack MERN application designed for scalable DSA learning and progress tracking.

The system supports:

* Secure authentication
* Topic-wise DSA sheets
* Problem tracking
* Learning resources
* Persistent progress

---

# Architecture Flow

```text
Client (React + Redux)
          ↓
Frontend Hosting (Netlify/Vercel)
          ↓
Nginx Reverse Proxy (AWS EC2)
          ↓
Node.js + Express Backend
          ↓
MongoDB Atlas
```

---

# Request Flow

```text
User Action
    ↓
React Component
    ↓
Redux Async Thunk
    ↓
Axios API Request
    ↓
Express API
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

# Authentication Flow

```text
User Login
    ↓
Credential Validation
    ↓
JWT Token Generation
    ↓
Access Token Returned
    ↓
Protected APIs Accessed Using Bearer Token
```

---

# Scalability Considerations

* Stateless backend APIs
* Normalized MongoDB schema
* Indexed collections
* CDN-based frontend hosting
* Nginx reverse proxy support
* Future Redis caching support

---

# Deployment

| Layer           | Deployment       |
| --------------- | ---------------- |
| Frontend        | Netlify / Vercel |
| Backend         | AWS EC2          |
| Reverse Proxy   | Nginx            |
| Process Manager | PM2              |
| Database        | MongoDB Atlas    |

---

# Short Database Schema Document

## 1. Users Collection

Stores authentication and user details.

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

### Indexes

```text
email
```

---

## 2. Topics Collection

Stores DSA topics.

```js
{
  _id,
  title,
  description,
  order
}
```

---

## 3. Problems Collection

Stores topic-wise DSA problems.

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

### Indexes

```text
topicId
```

---

## 4. User Progress Collection

Stores completion state for problems.

```js
{
  _id,
  userId,
  problemId,
  completed,
  completedAt
}
```

### Compound Index

```text
userId + problemId
```

---

# Relationships

| Collection              | Relationship |
| ----------------------- | ------------ |
| Topics → Problems       | One-to-Many  |
| Users → UserProgress    | One-to-Many  |
| Problems → UserProgress | One-to-Many  |

---

# Design Decisions

| Decision                     | Reason                       |
| ---------------------------- | ---------------------------- |
| MongoDB                      | Flexible schema              |
| JWT Authentication           | Stateless auth               |
| Separate Progress Collection | Better scalability           |
| Redux Toolkit                | Predictable state management |
| EC2 + Nginx                  | Production-like deployment   |
