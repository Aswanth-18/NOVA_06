# SkillSync — Backend API

> Node.js · Express.js · MongoDB · Mongoose · JWT · bcryptjs

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy the example and fill in your values
cp .env.example .env
```

Edit `.env` and set your `MONGO_URI` (local or Atlas).

### 3. Start the Server
```bash
npm run dev        # Development (nodemon hot-reload)
npm start          # Production
```

The API will be available at **`http://localhost:5000`**.

---

## Auth API Reference

Base URL: `http://localhost:5000/api/v1`

### Health Check
```
GET /health
```
**Response**
```json
{
  "success": true,
  "message": "SkillSync API is healthy 🚀",
  "environment": "development"
}
```

---

### POST `/auth/signup` — Register a new user
**Access:** Public

**Request Body**
```json
{
  "fullName":       "Aswanth Kumar",
  "registerNumber": "CS21001",
  "email":          "aswanth@college.edu",
  "password":       "secret123",
  "department":     "CSE",
  "year":           2,
  "role":           "student"
}
```

> `role` is optional — defaults to `"student"`.  
> Allowed roles: `student` · `mentor` · `faculty` · `admin`  
> Allowed departments: `CSE` · `IT` · `ECE` · `EEE` · `MECH` · `CIVIL` · `AIDS` · `AIML` · `CSD` · `CSBS` · `OTHER`

**Success Response — 201**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "<JWT>",
    "user": {
      "_id":              "...",
      "fullName":         "Aswanth Kumar",
      "registerNumber":   "CS21001",
      "email":            "aswanth@college.edu",
      "department":       "CSE",
      "year":             2,
      "role":             "student",
      "profileImage":     "",
      "isVerifiedMentor": false,
      "createdAt":        "2026-08-01T..."
    }
  }
}
```

**Error Responses**
| Status | Cause |
|--------|-------|
| 400    | Missing required fields |
| 409    | Email or register number already exists |
| 422    | Validation errors (bad department, year out of range, etc.) |

---

### POST `/auth/login` — Login
**Access:** Public

**Request Body**
```json
{
  "email":    "aswanth@college.edu",
  "password": "secret123"
}
```

**Success Response — 200**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "<JWT>",
    "user": { "...same structure as signup..." }
  }
}
```

**Error Responses**
| Status | Cause |
|--------|-------|
| 400    | Missing email or password |
| 401    | Invalid email or password (generic — no user enumeration) |

---

### GET `/auth/me` — Get current user
**Access:** 🔒 Private (JWT required)

**Headers**
```
Authorization: Bearer <token>
```

**Success Response — 200**
```json
{
  "success": true,
  "message": "User profile retrieved.",
  "data": {
    "user": { "...public user object..." }
  }
}
```

**Error Responses**
| Status | Cause |
|--------|-------|
| 401    | No token / invalid token / expired token |
| 404    | User deleted after token was issued |

---

## Project Structure

```
backend/
├── app.js              Express application factory
├── server.js           Entry point (dotenv → DB → HTTP server)
├── .env                Environment variables (git-ignored)
├── .env.example        Environment variable template
└── src/
    ├── config/
    │   ├── db.js           Mongoose connection
    │   ├── corsOptions.js  CORS config
    │   └── rateLimiter.js  Rate limiting config
    ├── controllers/
    │   ├── authController.js    signup · login · getMe
    │   ├── userController.js    CRUD stubs
    │   ├── skillController.js   CRUD stubs
    │   └── sessionController.js CRUD stubs
    ├── middleware/
    │   ├── authMiddleware.js    protect · authorize
    │   ├── errorHandler.js      Global error catcher
    │   ├── notFound.js          404 handler
    │   └── validateRequest.js   express-validator helper
    ├── models/
    │   ├── User.js     fullName · registerNumber · email · password (hashed) · department · year · role · profileImage · isVerifiedMentor
    │   ├── Skill.js    Placeholder
    │   └── Session.js  Placeholder
    ├── routes/
    │   ├── index.js         Central registry
    │   ├── authRoutes.js    /auth/*
    │   ├── userRoutes.js    /users/*
    │   ├── skillRoutes.js   /skills/*
    │   └── sessionRoutes.js /sessions/*
    ├── utils/
    │   ├── asyncHandler.js  Eliminates try/catch in controllers
    │   ├── apiResponse.js   sendSuccess() / sendError()
    │   └── generateToken.js JWT signing helper
    └── data/
        └── .gitkeep    Reserved for seed scripts
```

## Security Features
- **Passwords** hashed with bcrypt (12 salt rounds)
- **JWT** signed with `JWT_SECRET` from environment, expires in `JWT_EXPIRES_IN`
- **Password field** excluded from all queries (`select: false`)
- **re-fetches user on every protected request** — deleted accounts are immediately rejected
- **Generic error messages** on login — no user enumeration
- **Helmet** — secure HTTP headers on every response
- **CORS** — only allowed origins from `ALLOWED_ORIGINS`
- **Rate limiting** — 100 requests per 15 minutes per IP on all `/api` routes
- **Body size limit** — 10kb to prevent large payload attacks
