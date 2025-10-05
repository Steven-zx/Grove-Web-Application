# Grove Web Application Backend Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Supabase account and project
- Code editor (VS Code recommended)

## Quick Setup

### 1. Environment Configuration
1. Copy the `.env` file and update with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   ```

2. Set up admin credentials in `.env`:
   ```
   ADMIN_EMAIL=admin@grove.com
   ADMIN_PASSWORD=your_admin_password
   ```

### 2. Database Setup
1. Log in to your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Execute the SQL to create all tables and policies

### 3. Install Dependencies & Start Server
```bash
cd backend
npm install
npm start
```

The server will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

### User Management
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/admin/announcements` - Create announcement (admin only)
- `PUT /api/admin/announcements/:id` - Update announcement (admin only)
- `DELETE /api/admin/announcements/:id` - Delete announcement (admin only)

### Amenities & Bookings
- `GET /api/amenities` - Get all amenities
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)
- `GET /api/bookings/calendar` - Get calendar view of bookings
- `PUT /api/admin/bookings/:id` - Update booking status (admin only)
- `DELETE /api/bookings/:id` - Cancel booking (requires auth)

### Visitors
- `POST /api/visitors` - Register visitor & generate QR code (requires auth)
- `GET /api/visitors` - Get user's visitors (requires auth)

### Concerns/Issues
- `POST /api/concerns` - Submit concern/issue report (requires auth)
- `GET /api/admin/concerns` - Get all concerns (admin only)
- `PUT /api/admin/concerns/:id` - Update concern status (admin only)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)

### Health Check
- `GET /api/health` - Server health check

## Authentication
- Users: JWT token required for protected routes
- Admin: Special admin login with hardcoded credentials (configurable in .env)

## Database Tables Created
- `user_profiles` - Extended user information
- `announcements` - Community announcements
- `amenities` - Available facilities
- `bookings` - Amenity reservations
- `visitors` - Visitor registrations with QR codes
- `concerns` - Issue reports and concerns

## Security Features
- Rate limiting (configurable)
- Helmet.js security headers
- CORS protection
- JWT authentication
- Row Level Security (RLS) in Supabase
- Input validation

## Development
- Hot reload enabled
- Environment-based configuration
- Comprehensive error handling
- Structured logging

## Default Admin Credentials
- Email: admin@grove.com
- Password: (set in .env ADMIN_PASSWORD)

## Testing
Access the health check endpoint to verify the server is running:
```
GET http://localhost:3000/api/health
```

## Frontend Integration
The backend serves the frontend build files and provides API endpoints for:
- User authentication and profiles
- Amenity booking system with calendar
- Visitor management with QR codes
- Community announcements
- Issue/concern reporting
- Admin dashboard with statistics

## Support
For issues or questions, check the server logs and ensure:
1. Supabase credentials are correct
2. Database schema has been applied
3. All environment variables are set
4. Dependencies are installed