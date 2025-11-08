# Deployment Guide

## Deploying to Vercel (Frontend)

### Prerequisites
- GitHub account with code pushed
- Vercel account (free tier available)

### Steps

1. **Connect GitHub Repository**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repository

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add: \`NEXT_PUBLIC_API_URL\` with your backend URL

3. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Check deployment logs for any issues

### Environment Configuration
\`\`\`
NEXT_PUBLIC_API_URL=https://your-backend-api.com
\`\`\`

## Deploying Backend (Django on Heroku)

### Prerequisites
- Heroku account
- Git installed
- Heroku CLI

### Steps

1. **Create Heroku App**
\`\`\`bash
heroku login
heroku create your-app-name
\`\`\`

2. **Configure Database**
\`\`\`bash
heroku addons:create heroku-postgresql:hobby-dev
\`\`\`

3. **Set Environment Variables**
\`\`\`bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
\`\`\`

4. **Deploy**
\`\`\`bash
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
\`\`\`

5. **Configure CORS**
\`\`\`python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",
    "https://your-app-name.herokuapp.com",
]
\`\`\`

## Deploying Backend (AWS)

### Using Elastic Beanstalk

1. **Install AWS CLI**
2. **Create Beanstalk Environment**
3. **Deploy Application**
\`\`\`bash
eb create school-equipment-env
eb deploy
\`\`\`

## Deploying Backend (Docker)

### Dockerfile
\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "school_equipment.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

### Docker Compose
\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - SECRET_KEY=your-secret-key
      - DATABASE_URL=postgresql://user:password@db:5432/school_equip
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=school_equip
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

### Deploy with Docker
\`\`\`bash
docker-compose up -d
\`\`\`

## Production Checklist

- [ ] Set \`DEBUG=False\` in Django settings
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS for production domains
- [ ] Use environment variables for secrets
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure static file serving
- [ ] Test authentication flows
- [ ] Verify email notifications
- [ ] Monitor API rate limiting
- [ ] Set up CDN for static assets
- [ ] Configure auto-scaling if needed

## Performance Optimization

### Frontend
- Enable gzip compression
- Optimize images
- Minify CSS/JavaScript
- Use CDN for static assets

### Backend
- Add database indexes
- Use caching (Redis)
- Implement pagination
- Optimize API queries
- Use connection pooling

## Monitoring & Logging

### Frontend
- Set up error tracking (Sentry)
- Monitor performance metrics
- Track user analytics

### Backend
- Configure Django logging
- Use centralized logging (ELK Stack)
- Monitor database performance
- Track API response times

## Backup & Recovery

### Database
\`\`\`bash
# Backup PostgreSQL
pg_dump dbname > backup.sql

# Restore
psql dbname < backup.sql
\`\`\`

### Regular Backups
- Daily automated backups
- Weekly archive to cloud storage
- Monthly disaster recovery test

## SSL/TLS Certificate

- Use Let's Encrypt for free certificates
- Auto-renewal configured
- HTTP to HTTPS redirect

## Health Checks

Setup monitoring endpoints:
\`\`\`
GET /api/health/ - Returns 200 if healthy
\`\`\`

## Rollback Procedures

1. Identify deployment version
2. Revert to previous commit
3. Redeploy application
4. Verify functionality

## Support & Troubleshooting

- Check application logs
- Verify environment variables
- Test API connectivity
- Review database status
- Monitor system resources
\`\`\`
