# Grove Web Application - Setup Guide

## Quick Start Instructions

### Prerequisites
- Node.js (version 20.19+ recommended)
- Git
- Supabase account and project setup

### Environment Setup
1. Clone the repository
2. Set up environment variables in backend (Supabase keys)

### Running the System

#### Option 1: Using Batch Files (Windows - Recommended)
Simply double-click these files in order:
1. `start-backend.bat` - Starts backend server
2. `start-main.bat` - Starts user frontend
3. `start-admin.bat` - Starts admin frontend

#### Option 2: Manual Commands
Open 3 separate terminals and run:

**Terminal 1 - Backend:**
```bash
cd backend
node hotdog.js
```

**Terminal 2 - User Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin Frontend:**
```bash
cd admin/frontend
npm run dev
```

### Access URLs
- **User Frontend (Main):** http://localhost:5173
- **Admin Frontend:** http://localhost:5175
- **Backend API:** http://localhost:3000

### Default Admin Credentials
- **Email:** admin@augustinegrove.com
- **Password:** admin123

### Important Notes
- All 3 servers must be running simultaneously
- Backend must start first before frontends
- User bookings flow from main frontend to admin frontend
- Email confirmation has been bypassed for easier login

### Troubleshooting
- If ports are in use, servers will automatically try alternative ports
- Node.js version warnings can be ignored if servers start successfully
- Check console logs for any connection issues

---
**Last Updated:** October 7, 2025
**Status:** Production Ready ✅