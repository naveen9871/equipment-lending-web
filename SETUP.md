# School Equipment Lending Portal - Setup Guide

## Prerequisites
- Node.js 18+ and npm
- Backend API running at `http://localhost:8000`
- Python/Django backend configured

## Frontend Installation

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Backend Setup (Django)

### 1. Install Dependencies
\`\`\`bash
pip install django djangorestframework django-cors-headers python-decouple
\`\`\`

### 2. Create Django Project
\`\`\`bash
django-admin startproject school_equipment
cd school_equipment
django-admin startapp api
\`\`\`

### 3. Configure settings.py
\`\`\`python
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}
\`\`\`

### 4. Run Migrations
\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

### 5. Create Superuser
\`\`\`bash
python manage.py createsuperuser
\`\`\`

### 6. Start Backend Server
\`\`\`bash
python manage.py runserver 8000
\`\`\`

## Demo Credentials

### Student Account
- Username: `john_student`
- Password: `secure123`

### Staff Account
- Username: `staff_user`
- Password: `staff123`

## Features Implemented

✓ User Authentication & Role Management
✓ Equipment Management (Add/Edit/Delete)
✓ Student Dashboard with Equipment Listing
✓ Borrowing Request System
✓ Admin Dashboard with Statistics
✓ Request Approval/Rejection
✓ Equipment Issuance and Return Tracking
✓ Search & Filter Functionality
✓ Responsive Design
✓ Real-time Status Updates

## API Endpoints

See the Postman collection (and-8R7AG.ts) for complete API documentation.

## Troubleshooting

- **CORS Issues**: Ensure CORS_ALLOWED_ORIGINS includes your frontend URL
- **Token Errors**: Check that tokens are being stored in localStorage
- **API Connection**: Verify backend is running on port 8000
\`\`\`
