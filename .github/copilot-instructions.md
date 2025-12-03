# Grove-Web-Application: AI Agent Instructions

## Project Overview
Grove is a residential community management system with amenity booking, visitor management, announcements, and payment processing. Built as a monorepo with 3 separate deployable apps.

## Architecture

### Monorepo Structure
```
├── backend/              # Node.js Express API (port 3000)
│   ├── hotdog.js        # Main server (2300+ lines, single file)
│   ├── database-schema.sql
│   └── manual-payment-schema.sql
├── frontend/            # User React+Vite app (port 5173)
│   └── src/
│       ├── pages/       # Desktop & Mobile variants (e.g., Home.jsx, HomeMobile.jsx)
│       ├── components/  # Shared UI (shared/, layout/)
│       └── services/api.js
├── admin/frontend/      # Admin React+Vite app (port 5180)
└── tests/              # Manual test plans (no automation)
```

### Data Flow
1. **Frontends** → REST API → **Backend** → Supabase (Postgres + Storage)
2. Backend uses TWO Supabase clients:
   - `supabase`: Standard client (respects RLS)
   - `supabaseService`: Service role client (bypasses RLS for admin ops)
3. Authentication: JWT tokens stored in localStorage, auto-attached via axios interceptors

## Critical Development Workflows

### Starting Services (Windows)
```powershell
# Root-level convenience scripts:
npm run dev:all        # Starts all 3 services via concurrently

# OR start individually:
cd backend ; npm start                     # Backend
cd frontend ; npm run dev                  # User frontend
cd admin\frontend ; npm run dev            # Admin frontend

# Batch files also available:
.\start-backend.bat
.\start-main.bat
.\start-admin.bat
```

### Database Setup (One-time)
1. Create Supabase project, copy URL/keys to `backend/.env`
2. In Supabase SQL Editor, run in order:
   - `backend/database-schema.sql` (core tables)
   - `backend/fix-rls-policy.sql` (RLS policies for admin ops)
   - `backend/manual-payment-schema.sql` (GCash payment feature)
3. Backend auto-creates amenities on startup if missing

### Environment Variables
**Backend** (`backend/.env`):
```
SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY
JWT_SECRET, JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@augustinegrove.com
ADMIN_PASSWORD=admin123
GALLERY_BUCKET=gallery
PAYMONGO_MODE=test  # For GCash payments
PAYMONGO_SECRET_KEY, PAYMONGO_PUBLIC_KEY
PAYMONGO_SUCCESS_URL, PAYMONGO_FAILED_URL
MANUAL_GCASH_ENABLED=true
GCASH_ACCOUNT_NAME, GCASH_ACCOUNT_NUMBER
```

**Frontends** (Netlify/deployment):
```
VITE_API_BASE_URL=https://your-backend.onrender.com  # NO trailing slash
```

### Debugging Tips
- Backend logs startup: Check `🔑 Service key loaded`, `✅ Amenities initialized`
- Frontend API errors: Open browser console, look for `🔗 API configured:` log
- Health check: `GET http://localhost:3000/api/health` returns version
- If backend fails on startup, verify `.env` exists and has all Supabase keys

## Code Patterns & Conventions

### React Frontend (Both User & Admin)
```jsx
// Responsive pattern: Separate Desktop/Mobile components
function App() {
  const isMobile = useIsMobile();  // Custom hook, breakpoint 768px
  return isMobile ? <HomeMobile /> : <Home />;
}

// API calls via axios service (auto-includes JWT)
import api from '../services/api';
const response = await api.get('/api/bookings');

// Shared components in src/components/shared/
// Layout components (Navbar, Sidebar) in src/components/layout/
```

### Backend (Express)
```javascript
// Single-file server: backend/hotdog.js (all routes inline)
// Uses supabaseService for admin operations (bypasses RLS)
// Example: Admin announcement creation
app.post('/api/admin/announcements', verifyAdmin, async (req, res) => {
  const { data, error } = await supabaseService
    .from('announcements')
    .insert(req.body);
  // ...
});

// User operations use standard supabase client (RLS enforced)
```

### Key Backend Behaviors
1. **Amenities auto-initialization**: On startup, backend force-updates 4 amenities (Pool, Basketball, Clubhouse, Playground). Don't manually add via Supabase UI.
2. **Admin auth**: Hardcoded email/password from `.env`, no Supabase auth.users entry needed
3. **File uploads**: Use multer, stored in Supabase Storage `gallery` bucket
4. **Rate limiting**: Enabled on all routes, 100 req/15min per IP
5. **Booking status updates**: Admin endpoints use `supabaseService` (bypasses RLS). Status stored lowercase in DB, transformed to capitalized for UI display.

### Database Tables
- `user_profiles` (extends auth.users): first_name, last_name, phone, address
- `announcements`: title, description, category, importance (Low/Medium/High/Urgent)
- `amenities`: name, description, capacity, hourly_rate, available_hours, is_active
- `bookings`: user_id, amenity_id, booking_date, start_time, end_time, status (pending/confirmed/cancelled/pending_approval/rejected), payment_status, payment_proof_url
- `visitors`: user_id, name, purpose, vehicle_info, qr_code (base64)
- `concerns`: user_id, location, description, status (unread/in-progress/resolved)

## Common Tasks

### Adding New API Endpoint
1. Add route in `backend/hotdog.js` (search for similar endpoint as template)
2. Use `verifyToken` middleware for user auth, `verifyAdmin` for admin
3. Choose `supabase` (RLS) or `supabaseService` (bypass RLS) client
4. Test with `GET http://localhost:3000/api/health` to verify server running

### Adding Frontend Feature
1. Create page in `src/pages/Feature.jsx` AND `src/pages/FeatureMobile.jsx`
2. Add route in `App.jsx` for both desktop and mobile sections
3. Use `api.get/post()` from `services/api.js` for backend calls
4. Check `components/shared/` for reusable UI before creating new components

### Deployment (Netlify + Render)
- **Backend**: Deploy to Render.com, set all env vars, use `npm start` command
- **User frontend**: Netlify, base dir `frontend`, build `npm install && npm run build`, publish `frontend/dist`
- **Admin frontend**: Separate Netlify site, base dir `admin/frontend`, publish `admin/frontend/dist`
- **Post-deploy**: Update backend CORS in `hotdog.js` to allow Netlify URLs, set `VITE_API_BASE_URL` in Netlify env vars

## Payment Systems
1. **PayMongo GCash** (automated): User redirects to checkout, webhook updates booking
2. **Manual GCash**: User uploads proof screenshot, admin approves/rejects in dashboard

## Testing
- Manual testing only (see `tests/TEST_PLAN.md`)
- Test script: `.\test-admin-login.ps1` (PowerShell)
- No Jest/Cypress yet, but structure supports future automation

## Project-Specific Gotchas
- **Vite port conflicts**: User frontend defaults 5173, admin 5180 (check `vite.config.js`)
- **Admin login fails**: Usually missing `VITE_API_BASE_URL` in deployment env
- **RLS blocks admin ops**: Run `backend/fix-rls-policy.sql` to add permissive policies
- **Amenities disappear**: Backend resets them on startup, check console logs
- **CORS errors**: Add frontend URL to `corsOptions.origin` array in `hotdog.js`

## Documentation Files
- `backend/README.md`: Complete API reference, all 25+ endpoints
- `DEPLOYMENT.md`: Step-by-step Netlify + Render deployment guide
- `ADMIN-LOGIN-FIX.md`: Troubleshooting admin authentication issues
- `MANUAL-PAYMENT-SETUP.md`: GCash manual payment integration guide
- `tests/TEST_PLAN.md`: QA procedures and test case structure
