# API Documentation

## Authentication Endpoints

### Register User
\`\`\`http
POST /api/users/register/
Content-Type: application/json

{
  "username": "john_student",
  "email": "john@school.edu",
  "password": "secure123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "department": "Computer Science"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": 1,
  "username": "john_student",
  "email": "john@school.edu",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"
}
\`\`\`

### Login
\`\`\`http
POST /api/token/
Content-Type: application/json

{
  "username": "john_student",
  "password": "secure123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

### Refresh Token
\`\`\`http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

### Get Current User
\`\`\`http
GET /api/users/me/
Authorization: Bearer {access_token}
\`\`\`

## Equipment Endpoints

### List Equipment
\`\`\`http
GET /api/equipment/
Authorization: Bearer {access_token}
\`\`\`

**Query Parameters:**
- \`available=true\` - Only available items
- \`search={query}\` - Search by name/description
- \`category={id}\` - Filter by category

### Get Equipment Details
\`\`\`http
GET /api/equipment/{id}/
Authorization: Bearer {access_token}
\`\`\`

### Create Equipment (Admin only)
\`\`\`http
POST /api/equipment/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Canon EOS R5",
  "category": 1,
  "description": "Professional mirrorless camera",
  "condition": "excellent",
  "total_quantity": 3,
  "location": "Photography Lab"
}
\`\`\`

### Update Equipment (Admin only)
\`\`\`http
PUT /api/equipment/{id}/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Canon EOS R5",
  "description": "Updated description",
  "condition": "good"
}
\`\`\`

## Borrow Request Endpoints

### Create Request
\`\`\`http
POST /api/requests/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "equipment": 1,
  "quantity": 1,
  "purpose": "Photography project for class",
  "borrow_from": "2025-11-10T09:00:00Z",
  "borrow_until": "2025-11-15T17:00:00Z"
}
\`\`\`

### List My Requests
\`\`\`http
GET /api/requests/my_requests/
Authorization: Bearer {access_token}
\`\`\`

### List Pending Requests (Staff)
\`\`\`http
GET /api/requests/pending/
Authorization: Bearer {staff_token}
\`\`\`

### Approve Request (Staff only)
\`\`\`http
POST /api/requests/{id}/approve/
Authorization: Bearer {staff_token}
\`\`\`

### Reject Request (Staff only)
\`\`\`http
POST /api/requests/{id}/reject/
Authorization: Bearer {staff_token}
Content-Type: application/json

{
  "reason": "Equipment unavailable during requested period"
}
\`\`\`

### Issue Equipment (Staff only)
\`\`\`http
POST /api/requests/{id}/issue/
Authorization: Bearer {staff_token}
\`\`\`

### Return Equipment (Staff only)
\`\`\`http
POST /api/requests/{id}/return_equipment/
Authorization: Bearer {staff_token}
Content-Type: application/json

{
  "notes": "Equipment returned in excellent condition"
}
\`\`\`

## Status Codes

- \`200\` - Success
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`409\` - Conflict (booking overlap)

## Error Response Format

\`\`\`json
{
  "detail": "Error message description"
}
\`\`\`

## Rate Limiting

API requests are limited to 100 per minute per user.

## CORS Configuration

Allowed origins:
- http://localhost:3000
- http://127.0.0.1:3000
\`\`\`
