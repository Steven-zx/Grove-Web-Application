# Grove-Web-Application: Copilot Agent Instructions

## Project Architecture
- **Monorepo Structure:**
  - `backend/`: Node.js Express server, Supabase integration, API endpoints, database schema, and admin logic.
  - `frontend/` and `admin/frontend/`: React + Vite apps for user and admin interfaces. Shared patterns, but separate entry points and builds.
  - `tests/`: Manual and template-based test plans, not automated.

## Key Workflows
- **Backend:**
  - Start: `cd backend; npm install; npm start` (serves on http://localhost:3000)
  - Environment: `.env` required (see `backend/README.md` for keys)
  - Database: Use Supabase dashboard to apply `database-schema.sql` and `fix-rls-policy.sql`.
  - Hot reload enabled for development.
- **Frontend:**
  - Start: `cd frontend; npm install; npm run dev` (Vite dev server)
  - Admin: `cd admin/frontend; npm install; npm run dev`
  - Builds: Vite config in each frontend folder.

## API & Data Flow
- **Backend exposes REST API** (see `backend/README.md` for endpoints)
  - Auth: JWT for users, hardcoded admin credentials from `.env`
  - Data: Supabase tables for users, amenities, bookings, announcements, visitors, concerns
  - Gallery: Supabase Storage bucket, configurable via env
- **Frontend/Backend Integration:**
  - Frontends consume backend APIs for all data and actions
  - No GraphQL, only REST
  - QR code generation for visitors (see booking/visitor flows)

## Conventions & Patterns
- **React:**
  - Functional components, hooks, and context
  - Shared UI components in `src/components/shared/` and `src/components/layout/`
  - Pages in `src/pages/`, services in `src/services/`
  - Minimal use of global state; prefer local state/hooks
- **Backend:**
  - API routes in Express, logic split by resource
  - Input validation, error handling, and security (Helmet, CORS, JWT, RLS)
  - Logging and rate limiting enabled
- **Testing:**
  - Manual test plans in `tests/` (see `TEST_PLAN.md`)
  - No automated test runner; health check endpoint for basic verification

## Integration Points
- **Supabase:**
  - Used for database, authentication, storage
  - All credentials/config in `.env` (never hardcode)
- **External:**
  - QR code generation for visitor management
  - File uploads via multipart/form-data

## Examples
- **Booking Flow:**
  - Frontend calls `POST /api/bookings` with JWT
  - Backend validates, stores in Supabase, returns booking info
- **Announcement Management:**
  - Admin frontend calls `POST/PUT/DELETE /api/admin/announcements` with admin JWT
  - Backend checks admin credentials, updates Supabase

## Tips for Agents
- Always check `.env` and Supabase setup before debugging backend issues
- Reference `backend/README.md` for API details and setup
- Use health check endpoint (`/api/health`) to verify backend status
- For new features, follow existing folder and component structure
- Prefer updating shared components/services for cross-cutting changes

---
For further details, see:
- `backend/README.md` (API, setup, security)
- `frontend/README.md` and `admin/frontend/README.md` (React/Vite setup)
- `tests/TEST_PLAN.md` (manual test conventions)
