# Quick Start Guide - School Equipment Lending Portal

## 5-Minute Setup

### Step 1: Frontend Installation
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`
Frontend ready at: http://localhost:3000

### Step 2: Backend Setup
\`\`\`bash
# Install Python packages
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Create Django project
django-admin startproject school_equipment
cd school_equipment
django-admin startapp api

# Run migrations
python manage.py migrate

# Start backend
python manage.py runserver 8000
\`\`\`
Backend ready at: http://localhost:8000

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Student | john_student | secure123 |
| Staff | staff_user | staff123 |

## Key Features Summary

### For Students
- Browse available equipment
- Search and filter by category
- Request equipment for specific dates
- Track request status in real-time
- View borrowing history

### For Staff/Admins
- Review pending requests
- Approve or reject requests with reasons
- Issue equipment and track returns
- Manage equipment inventory
- View system statistics and analytics

## Common Tasks

### As a Student

**1. Request Equipment**
1. Login at http://localhost:3000/login
2. Go to Student Dashboard
3. Click "Request to Borrow" on any equipment
4. Fill in quantity, purpose, and dates
5. Submit request

**2. Track Your Requests**
1. Go to "My Requests" section
2. View all your borrow requests
3. Check status (pending, approved, issued, etc.)

### As Staff/Admin

**1. Approve Requests**
1. Login as staff
2. Go to Admin Dashboard
3. Navigate to Requests section
4. View pending requests
5. Click Approve or Reject

**2. Issue Equipment**
1. Find approved request
2. Click "Issue Equipment"
3. Physically hand over the item
4. Status updates to "issued"

**3. Record Returns**
1. Find issued request
2. Click "Return Equipment"
3. Add return notes
4. Mark as returned

**4. Add Equipment**
1. Go to Equipment Management
2. Click "Add Equipment"
3. Fill in details (name, quantity, condition)
4. Save equipment

## Project Structure Overview

\`\`\`
Frontend (React/Next.js)
├── Pages
│   ├── Landing page (/)
│   ├── Login (/login)
│   ├── Student dashboard (/student/dashboard)
│   └── Admin dashboard (/admin/dashboard)
├── Components
│   ├── Equipment card
│   ├── Layouts (student, admin)
│   └── UI components
└── Styles
    └── Tailwind CSS

Backend (Django/REST API)
├── Authentication
│   ├── User registration
│   ├── JWT tokens
│   └── Role management
├── Equipment
│   ├── CRUD operations
│   ├── Availability tracking
│   └── Category management
└── Requests
    ├── Creation and submission
    ├── Approval workflow
    ├── Status tracking
    └── Return management
\`\`\`

## API Endpoints Quick Reference

### Auth
- POST /api/token/ → Login
- POST /api/token/refresh/ → Refresh token
- GET /api/users/me/ → Current user

### Equipment
- GET /api/equipment/ → List equipment
- POST /api/equipment/ → Create (admin only)
- PUT /api/equipment/{id}/ → Update (admin only)

### Requests
- GET /api/requests/my_requests/ → My requests
- POST /api/requests/ → Create request
- POST /api/requests/{id}/approve/ → Approve (staff)
- POST /api/requests/{id}/issue/ → Issue (staff)
- POST /api/requests/{id}/return_equipment/ → Return (staff)

## Troubleshooting

### "Connection refused" error
- Check backend is running: \`python manage.py runserver 8000\`
- Check CORS is configured in Django settings

### "Invalid credentials" on login
- Use correct username and password from demo credentials
- Check database has users created

### "Token expired"
- Auto-refresh happens in background
- If stuck, clear localStorage and login again

### Page not loading
- Check frontend is running: \`npm run dev\`
- Clear browser cache and hard refresh
- Check console for errors

## Environment Files

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### Backend (settings.py)
- Set DEBUG = False for production
- Configure ALLOWED_HOSTS
- Set SECRET_KEY to strong value

## Running Tests

### Manual Testing Checklist
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Can view equipment list
- [ ] Can search/filter equipment
- [ ] Can submit borrow request
- [ ] Can track request status
- [ ] Staff can approve requests
- [ ] Staff can reject requests
- [ ] Equipment can be issued
- [ ] Equipment can be returned
- [ ] Admin can add equipment
- [ ] Admin can view statistics

## Performance Tips

- Clear browser cache if seeing old data
- Restart backend if changes not reflecting
- Check network tab for failed API calls
- Monitor browser console for errors

## Customization

### Changing Color Scheme
Edit \`app/globals.css\` theme colors

### Adding Equipment Categories
1. Create in backend model
2. Update category select in UI

### Modifying Status Workflow
1. Update backend status choices
2. Update status badge colors
3. Update workflow logic in components

## Next Steps

1. Deploy to production (see DEPLOYMENT.md)
2. Configure email notifications
3. Add advanced analytics
4. Implement QR code scanning
5. Create mobile app

## Support Resources

- Postman Collection: and-8R7AG.ts
- Full Documentation: README.md
- API Docs: API_DOCUMENTATION.md
- Deployment Guide: DEPLOYMENT.md

## File Descriptions

| File | Purpose |
|------|---------|
| README.md | Comprehensive documentation |
| SETUP.md | Detailed setup instructions |
| QUICK_START.md | This quick start guide |
| API_DOCUMENTATION.md | API endpoint reference |
| DEPLOYMENT.md | Production deployment guide |
| install.sh | Automated frontend setup |
| run.sh | Quick startup script |

---

**Ready to go!** Start with the 5-minute setup above and refer to other docs as needed.
\`\`\`
\`\`\`
