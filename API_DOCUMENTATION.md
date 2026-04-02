# API Documentation

Complete API reference for the Finance Dashboard Backend.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All authenticated endpoints require JWT tokens stored in httpOnly cookies. Tokens are automatically set after successful login or signup.

**Token Types:**
- Access Token: 15-minute expiry
- Refresh Token: 7-day expiry

---

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### Validation Error Response
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

---

## Authentication Endpoints

### 1. Signup

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- `name`: 2-50 characters, letters and spaces only
- `email`: Valid email format
- `password`: Minimum 6 characters, must contain uppercase, lowercase, and number

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation failed or user already exists
- `500`: Internal server error

---

### 2. Login

Authenticate existing user.

**Endpoint:** `POST /auth/login`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "message": "User login successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials or missing fields
- `500`: Internal server error

---

### 3. Logout

Clear authentication tokens.

**Endpoint:** `POST /auth/logout`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 4. Check Authentication

Verify current authentication status.

**Endpoint:** `GET /auth/checkAuth`

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "User is authenticated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "isActive": true
  },
  "tokenRefreshed": false
}
```

**Error Responses:**
- `401`: Unauthorized or invalid token
- `500`: Internal server error

---

### 5. Refresh Token

Manually refresh access and refresh tokens.

**Endpoint:** `POST /auth/refresh`

**Rate Limit:** 10 requests per hour

**Authentication:** Requires valid refresh token

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully"
}
```

**Error Responses:**
- `401`: Invalid or expired refresh token
- `500`: Internal server error

---

## User Management Endpoints

All user management endpoints require Admin role.

### 6. Create User

Create a new user (Admin only).

**Endpoint:** `POST /user`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password123",
  "role": "analyst"
}
```

**Validation Rules:**
- `name`: 2-50 characters, letters and spaces only
- `email`: Valid email format
- `password`: Minimum 6 characters, must contain uppercase, lowercase, and number
- `role`: Must be `viewer`, `analyst`, or `admin` (optional, defaults to `viewer`)

**Success Response (201):**
```json
{
  "message": "User created sucessfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "analyst",
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation failed or user already exists
- `401`: Unauthorized
- `403`: Access denied (not admin)
- `500`: Internal server error

---

### 7. Get All Users

Retrieve all users in the system.

**Endpoint:** `GET /user`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**Success Response (200):**
```json
{
  "message": "Users fetched sucessfully",
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "analyst",
      "isActive": true,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 8. Get User By ID

Retrieve specific user by ID.

**Endpoint:** `GET /user/:id`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "message": "User fetched sucessfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid user ID format
- `401`: Unauthorized
- `403`: Access denied
- `404`: User not found
- `500`: Internal server error

---

### 9. Update User Role

Update user's role.

**Endpoint:** `PUT /user/:id/role`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user

**Request Body:**
```json
{
  "role": "admin"
}
```

**Validation Rules:**
- `role`: Must be `viewer`, `analyst`, or `admin`

**Success Response (200):**
```json
{
  "message": "User role updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid role or user ID
- `401`: Unauthorized
- `403`: Access denied
- `404`: User not found
- `500`: Internal server error

---

### 10. Toggle User Status

Toggle user active/inactive status.

**Endpoint:** `PUT /user/:id/status`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "message": "User activated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid user ID
- `401`: Unauthorized
- `403`: Access denied
- `404`: User not found
- `500`: Internal server error

---

### 11. Delete User

Delete user from system.

**Endpoint:** `DELETE /user/:id`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**URL Parameters:**
- `id`: MongoDB ObjectId of the user

**Success Response (200):**
```json
{
  "message": "User deleted"
}
```

**Error Responses:**
- `400`: Invalid user ID
- `401`: Unauthorized
- `403`: Access denied
- `404`: User not found
- `500`: Internal server error

---

## Financial Record Endpoints

### 12. Create Record

Create a new financial record.

**Endpoint:** `POST /record`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**Request Body:**
```json
{
  "amount": 1500.50,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "notes": "Monthly salary payment"
}
```

**Validation Rules:**
- `amount`: Positive number greater than 0
- `type`: Must be `income` or `expense`
- `category`: 1-50 characters, alphanumeric with spaces, hyphens, underscores
- `date`: ISO 8601 format (optional, defaults to current date)
- `notes`: Maximum 500 characters (optional)

**Success Response (201):**
```json
{
  "message": "Record created successfully",
  "record": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 1500.50,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15T00:00:00.000Z",
    "notes": "Monthly salary payment",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation failed or missing required fields
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 13. Get Records

Retrieve financial records with optional filtering.

**Endpoint:** `GET /record`

**Authentication:** Required (Admin, Analyst)

**Rate Limit:** 200 requests per 15 minutes

**Query Parameters:**
- `type`: Filter by `income` or `expense` (optional)
- `category`: Filter by category name (optional)

**Examples:**
- `/record` - Get all records
- `/record?type=income` - Get only income records
- `/record?category=Salary` - Get records in Salary category
- `/record?type=expense&category=Groceries` - Get expense records in Groceries category

**Success Response (200):**
```json
{
  "message": "Records fetched sucessfully",
  "records": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 1500.50,
      "type": "income",
      "category": "Salary",
      "date": "2024-01-15T00:00:00.000Z",
      "notes": "Monthly salary payment",
      "createdAt": "2024-01-15T13:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400`: Invalid query parameters
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 14. Update Record

Update existing financial record.

**Endpoint:** `PUT /record/:id`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**URL Parameters:**
- `id`: MongoDB ObjectId of the record

**Request Body (all fields optional):**
```json
{
  "amount": 1600.00,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "notes": "Updated salary amount"
}
```

**Success Response (200):**
```json
{
  "message": "Record updated",
  "record": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 1600.00,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15T00:00:00.000Z",
    "notes": "Updated salary amount",
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Invalid record ID or validation failed
- `401`: Unauthorized
- `403`: Access denied
- `404`: Record not found or not owned by user
- `500`: Internal server error

---

### 15. Delete Record

Delete financial record.

**Endpoint:** `DELETE /record/:id`

**Authentication:** Required (Admin)

**Rate Limit:** 200 requests per 15 minutes

**URL Parameters:**
- `id`: MongoDB ObjectId of the record

**Success Response (200):**
```json
{
  "message": "Record deleted sucessfully"
}
```

**Error Responses:**
- `400`: Invalid record ID
- `401`: Unauthorized
- `403`: Access denied
- `404`: Record not found or not owned by user
- `500`: Internal server error

---

## Dashboard & Analytics Endpoints

### 16. Get Summary

Get financial summary for authenticated user.

**Endpoint:** `GET /record/summary`

**Authentication:** Required (Admin, Analyst)

**Rate Limit:** 200 requests per 15 minutes

**Success Response (200):**
```json
{
  "message": "Summary formed",
  "totalIncome": 5000.00,
  "totalExpense": 2000.00,
  "netBalance": 3000.00
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 17. Get Category Breakdown

Get spending/income breakdown by category.

**Endpoint:** `GET /record/category-breakdown`

**Authentication:** Required (Admin, Analyst)

**Rate Limit:** 200 requests per 15 minutes

**Success Response (200):**
```json
{
  "message": "Breakdown achieved",
  "result": {
    "Salary": 5000.00,
    "Groceries": 500.00,
    "Rent": 1200.00,
    "Utilities": 300.00
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 18. Get Monthly Trends

Get monthly trend analysis.

**Endpoint:** `GET /record/trends`

**Authentication:** Required (Admin, Analyst)

**Rate Limit:** 200 requests per 15 minutes

**Success Response (200):**
```json
{
  "message": "Monthly trends recieved",
  "trends": {
    "2024-01": 3000.00,
    "2024-02": 3500.00,
    "2024-03": 2800.00
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 19. Get Weekly Trends

Get weekly trend analysis with income/expense breakdown.

**Endpoint:** `GET /record/weekly-trends`

**Authentication:** Required (Admin, Analyst)

**Rate Limit:** 200 requests per 15 minutes

**Success Response (200):**
```json
{
  "message": "Weekly trends received",
  "weeklyTrends": {
    "2024-W01": {
      "income": 1000.00,
      "expense": 300.00,
      "total": 1300.00,
      "count": 5
    },
    "2024-W02": {
      "income": 1200.00,
      "expense": 400.00,
      "total": 1600.00,
      "count": 7
    }
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

### 20. Get Recent Activity

Get recent financial activity.

**Endpoint:** `GET /record/recent-activity`

**Authentication:** Required (Admin, Analyst, Viewer)

**Rate Limit:** 200 requests per 15 minutes

**Query Parameters:**
- `limit`: Number of records to return (optional, default: 10)

**Example:** `/record/recent-activity?limit=20`

**Success Response (200):**
```json
{
  "message": "Recent activity fetched successfully",
  "recentRecords": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "amount": 1500.50,
      "type": "income",
      "category": "Salary",
      "date": "2024-01-15T00:00:00.000Z",
      "notes": "Monthly salary payment",
      "createdAt": "2024-01-15T13:00:00.000Z"
    }
  ],
  "summary": {
    "totalRecords": 10,
    "recentIncome": 2000.00,
    "recentExpenses": 500.00
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Access denied
- `500`: Internal server error

---

## Rate Limiting

All endpoints are protected by rate limiting to prevent abuse.

### Rate Limit Tiers

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General | 100 requests | 15 minutes |
| Authentication (signup, login) | 5 requests | 15 minutes |
| API (user, record) | 200 requests | 15 minutes |
| Token Refresh | 10 requests | 1 hour |

### Rate Limit Headers

All responses include rate limit information:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1642345678
```

### Rate Limit Exceeded Response

**Status Code:** 429

```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## Authentication Flow

### Initial Authentication

1. User signs up or logs in
2. Server generates access token (15 min) and refresh token (7 days)
3. Tokens stored in httpOnly cookies
4. Client includes cookies in subsequent requests

### Token Rotation

1. Access token expires after 15 minutes
2. On next request, middleware detects expired access token
3. Validates refresh token
4. Generates new access and refresh tokens
5. Updates cookies with new tokens
6. Request continues with new tokens

### Manual Token Refresh

1. Client calls `/auth/refresh` endpoint
2. Server validates refresh token
3. Generates new access and refresh tokens
4. Updates cookies
5. Returns success response

---

## Role-Based Access

### Permission Matrix

| Endpoint | Viewer | Analyst | Admin |
|----------|--------|---------|-------|
| POST /record | ❌ | ❌ | ✅ |
| GET /record | ❌ | ✅ | ✅ |
| PUT /record/:id | ❌ | ❌ | ✅ |
| DELETE /record/:id | ❌ | ❌ | ✅ |
| GET /record/summary | ❌ | ✅ | ✅ |
| GET /record/category-breakdown | ❌ | ✅ | ✅ |
| GET /record/trends | ❌ | ✅ | ✅ |
| GET /record/weekly-trends | ❌ | ✅ | ✅ |
| GET /record/recent-activity | ✅ | ✅ | ✅ |
| POST /user | ❌ | ❌ | ✅ |
| GET /user | ❌ | ❌ | ✅ |
| PUT /user/:id/role | ❌ | ❌ | ✅ |
| PUT /user/:id/status | ❌ | ❌ | ✅ |
| DELETE /user/:id | ❌ | ❌ | ✅ |

---

## Testing with Postman

### Setup

1. Import all endpoints into Postman
2. Create environment with `baseUrl` variable
3. Enable cookie handling in Postman settings

### Testing Sequence

1. **Signup** - Create admin account
2. **Login** - Authenticate and save cookies
3. **Create Users** - Add analyst and viewer accounts
4. **Create Records** - Add income and expense records
5. **Test Analytics** - Verify summary and trends
6. **Test Roles** - Login as different users and verify permissions
7. **Test Rate Limits** - Exceed limits to verify blocking

---

## Common Issues

### Issue: 401 Unauthorized

**Cause:** Missing or invalid authentication token

**Solution:** Login again to get fresh tokens

---

### Issue: 403 Access Denied

**Cause:** User role doesn't have permission for the endpoint

**Solution:** Verify user role and endpoint requirements

---

### Issue: 429 Too Many Requests

**Cause:** Rate limit exceeded

**Solution:** Wait for the specified retry period

---

### Issue: 400 Validation Failed

**Cause:** Invalid input data

**Solution:** Check validation rules and fix request body

---
