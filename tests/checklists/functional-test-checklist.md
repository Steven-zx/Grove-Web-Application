# Functional Test Checklist (Simple)

Purpose: Quick, simple coverage of main functionalities. Use this to divide work across the team.

Legend: Priority P1 (must have), P2 (should have)

## 1) Authentication (Admin) – P1
- Cases to write: 5
  1. Login success with valid credentials (200, token stored)
  2. Login fails with wrong password (401)
  3. Login fails with missing email/password (400)
  4. Access admin API without token (401)
  5. Access admin API with token (200)
- Where to test: Admin frontend (UI) + Postman or backend smoke
- Suggested owner: Backend QA + E2E Lead

## 2) Announcements (Admin CRUD) – P1
- Cases to write: 10
  1. List announcements (200, array)
  2. Create announcement - valid (201)
  3. Create announcement - missing title (400)
  4. Create announcement - long title (validation if any)
  5. Edit announcement - valid (200)
  6. Edit announcement - invalid id (404)
  7. Delete announcement - valid (200/204)
  8. Delete announcement - invalid id (404)
  9. Unauthorized create (401 without token)
  10. Image URL optional handling (null allowed)
- Where to test: Admin frontend (UI) + API via Postman
- Suggested owner: Backend QA + Frontend QA

## 3) Announcements (Resident View) – P1
- Cases to write: 5
  1. Resident can see latest announcements on main frontend
  2. Dates and details render correctly
  3. Placeholder image used when image_url missing
  4. Empty state shows friendly message (no announcements)
  5. Basic performance acceptable (<500ms to fetch)
- Where to test: Main frontend
- Suggested owner: Frontend QA

## 4) Navigation & Access Control – P1
- Cases to write: 5
  1. Admin routes accessible only after login
  2. Direct access to admin pages without login redirects to /login
  3. Sidebar links navigate correctly (Announcements, Amenities, Gallery, Reports)
  4. Navbar renders and active route highlights correctly
  5. Unknown routes handled gracefully (Navigate to /announcements)
- Where to test: Admin frontend
- Suggested owner: E2E Lead

## 5) Gallery & Amenities (Content Render) – P2
- Cases to write: 4
  1. Gallery images render (no broken images)
  2. Amenities page loads with expected sections
  3. Navigation back and forth does not break layout
  4. Responsive checks on common widths (desktop/mobile)
- Where to test: Admin and main frontend (as applicable)
- Suggested owner: Frontend QA

## 6) Reports/Concerns/Visitors (API presence) – P2
- Cases to write: 4
  1. Endpoint responds (200)
  2. Unauthorized access blocked (401)
  3. Basic create/list returns expected schema
  4. Validation error on missing required fields
- Where to test: Postman (or simple Node scripts)
- Suggested owner: Backend QA

## 7) Basic Reliability/Performance – P2
- Cases to write: 2
  1. Health endpoint returns OK consistently
  2. Announcements list responds under 500ms locally
- Where to test: npm run test:smoke + manual timing
- Suggested owner: QA Lead

---

Total test cases (initial): 35

## Assignments (simple split)
- QA Lead (you): Sections 1 (review), 7; coordinate and review PRs
- Backend QA: Sections 1, 2 (API), 6
- Frontend QA: Sections 2 (UI parts), 3, 5
- E2E Lead: Sections 1 (flows), 4

## Execute locations
- UI tests: Admin frontend http://localhost:5176, Main frontend http://localhost:5174
- API tests: Postman or backend `npm run test:smoke` (health, login, list)

## Evidence capture
- For each case, record: Steps, Expected, Actual, Status, Screenshot/console log if applicable.
