# Finance Dashboard Backend

A backend system for managing financial records with role-based access control, JWT authentication, and rate limiting.

---

## Project Overview

This application provides a REST API for a finance dashboard where users can manage financial transactions based on their assigned roles. The system supports three user roles (Viewer, Analyst, Admin) with different permission levels, implements JWT-based authentication with token rotation, and includes rate limiting for security.

---

## Tech Stack

- **Node.js** with **Express.js** (v5.2.1)
- **MongoDB** with **Mongoose** (v9.3.3)
- **JWT** (v9.0.3) for authentication
- **bcrypt** (v6.0.0) for password hashing
- **express-rate-limit** (v8.3.2) for rate limiting
- **express-validator** (v7.3.2) for input validation

---

## Features

- User management with role assignment (Viewer, Analyst, Admin)
- Financial record CRUD operations
- Dashboard analytics (summaries, trends, category breakdowns)
- JWT access and refresh tokens with automatic rotation
- Role-based authorization
- Rate limiting on sensitive endpoints
- Input validation and sanitization

---

## Setup Instructions

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment variables**

Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

**3. Start the server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Authentication

**POST** `/api/auth/signup`
- Create new user account
- Body: `{ name, email, password }`

**POST** `/api/auth/login`
- Authenticate user
- Body: `{ email, password }`

**POST** `/api/auth/logout`
- Clear authentication tokens

**GET** `/api/auth/checkAuth`
- Verify authentication status
- Requires: Authentication

**POST** `/api/auth/refresh`
- Refresh access and refresh tokens
- Requires: Valid refresh token

---

### User Management (Admin Only)

**POST** `/api/user`
- Create new user
- Body: `{ name, email, password, role }`

**GET** `/api/user`
- Get all users

**GET** `/api/user/:id`
- Get user by ID

**PUT** `/api/user/:id/role`
- Update user role
- Body: `{ role }`

**PUT** `/api/user/:id/status`
- Toggle user active/inactive status

**DELETE** `/api/user/:id`
- Delete user

---

### Financial Records

**POST** `/api/record`
- Create financial record (Admin only)
- Body: `{ amount, type, category, date, notes }`

**GET** `/api/record`
- Get records with optional filters (Admin, Analyst)
- Query: `?type=income&category=Salary`

**PUT** `/api/record/:id`
- Update record (Admin only)
- Body: Any record fields

**DELETE** `/api/record/:id`
- Delete record (Admin only)

---

### Dashboard & Analytics

**GET** `/api/record/summary`
- Get total income, expenses, and net balance (Admin, Analyst)

**GET** `/api/record/category-breakdown`
- Get spending breakdown by category (Admin, Analyst)

**GET** `/api/record/trends`
- Get monthly trend analysis (Admin, Analyst)

**GET** `/api/record/weekly-trends`
- Get weekly trend analysis with income/expense breakdown (Admin, Analyst)

**GET** `/api/record/recent-activity`
- Get recent transactions with summary (Admin, Analyst, Viewer)
- Query: `?limit=10`

---

## Role-Based Access Control

**Viewer**
- View recent activity only

**Analyst**
- View all records
- Access all analytics and summaries
- Cannot modify data

**Admin**
- Full access to all operations
- Manage users and records

---

## Security Features

**JWT Token Rotation**
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Automatic token rotation on expiry
- Both tokens rotate together for enhanced security

**Rate Limiting**
- Auth endpoints: 5 requests per 15 minutes
- API endpoints: 200 requests per 15 minutes
- Token refresh: 10 requests per hour
- General limit: 100 requests per 15 minutes

**Input Validation**
- All inputs validated before processing
- Email normalization
- HTML escaping to prevent XSS
- MongoDB ObjectId validation

**Password Security**
- Bcrypt hashing with salt rounds of 10
- Passwords never returned in responses
- Minimum password requirements enforced

**User Ownership**
- Users can only access their own records
- Enforced at database query level

---

## Project Structure

```
backend/
├── controllers/       # Business logic
├── middlewares/       # Auth, validation, rate limiting
├── models/           # Database schemas
├── routes/           # API routes
├── utils/            # Helper functions
├── db/               # Database connection
└── index.js          # Entry point
```

---

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description"
}
```

Validation errors include details:
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---
