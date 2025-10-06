# Grove Web Application – Test Plan

Version: 1.0 • Owner: QA Lead (Group Leader) • Date: 2025-10-06

## 1. Scope and objectives

Covers functional and non-functional testing for:
- Authentication (Admin login)
- Announcements (CRUD, list, validation)
- Amenities, Gallery (content rendering)
- Bookings (creation, validation) — if applicable
- Visitors / Concerns / Reports (API endpoints from backend)
- Admin dashboard navigation and access control
- Non-functional: performance (basic), security (auth, headers), usability (key flows), reliability (smoke)

Goals
- Verify core user journeys: Admin can log in and manage announcements; residents can view announcements.
- Prevent regressions with repeatable scripts (smoke, unit/integration/E2E later).

Out of scope (this iteration)
- Full load tests and advanced security scans (planned later).

## 2. Test types and tools

- Smoke tests (now): Node script using fetch to validate health, login, and announcements API
- API/Integration tests (planned): Jest + Supertest for Express endpoints
- Frontend unit tests (planned): Vitest + React Testing Library
- E2E tests (planned): Cypress to cover admin flows and resident views
- UAT (now): Checklist-based manual runs with pass/fail capture
- Performance (basic): response time checks in smoke and E2E

Tools summary
- Backend: Node 20+, Jest, Supertest (planned), fetch for smoke (no deps)
- Frontend: Vitest + RTL (planned), Cypress (planned)
- Reporting: Markdown test case sheets + simple pass/fail log; issues tracked in repo

## 3. Environments

Local dev (Windows):
- Backend API: http://localhost:3000
- Main Frontend: http://localhost:5174 (or 5173)
- Admin Frontend: http://localhost:5176
- Node: 20.19+ recommended (Vite requires 20.19+); current: 20.12.2 works for backend and smoke tests
- Browser: Chrome latest

Test data
- Admin credentials: admin@augustinegrove.com / admin123
- Announcements table in Supabase (RLS handled by service role in backend)

## 4. Test case structure

Each test case includes:
- ID, Title, Priority (P1/P2/P3), Component/Feature
- Preconditions/Test data
- Steps
- Expected result
- Actual result, Status (Pass/Fail/Blocked)
- Owner, Date, Comments, Evidence (screenshots/logs)

See template: tests/templates/test-case-template.md

## 5. Entry/Exit criteria

Entry
- Backend server running with valid env (.env in backend)
- Required frontend(s) running for UI tests

Exit (per cycle)
- 100% of P1 functional cases executed with ≥95% pass rate
- No open P1 defects; P2 defects triaged with fix plan

## 6. Test coverage map (features → test types)

| Feature | Smoke | API/Int | FE Unit | E2E | UAT |
|---|---|---|---|---|---|
| Auth (Admin) | ✓ | ✓ | — | ✓ | ✓ |
| Announcements | ✓ | ✓ | ✓ (UI logic) | ✓ | ✓ |
| Amenities/Gallery | — | — | ✓ (render) | ✓ | ✓ |
| Reports/Concerns/Visitors | — | ✓ | — | ✓ | ✓ |
| Navigation/Access control | — | — | — | ✓ | ✓ |

## 7. Workload split (RACI-style)

- QA Lead (Group Leader): Plan, review, UAT coordination, final sign-off
- Backend QA: API/Integration tests (Auth, Announcements, Reports)
- Frontend QA: Unit tests for pages/components (Announcements, Gallery, Amenities)
- E2E Lead: Cypress flows (Admin login, Create/Edit/Delete announcement, Resident view)
- Data Steward: Seed/reset test data, environment checks, credentials management

Suggested assignment by module
- Auth + Access control: E2E Lead (tests), Backend QA (API), QA Lead (UAT)
- Announcements: Backend QA (API), Frontend QA (UI), E2E Lead (flows)
- Gallery/Amenities: Frontend QA (render + routes), E2E Lead (navigation)
- Reports/Concerns/Visitors: Backend QA (API), E2E Lead (flows)

## 8. Timeline (1–2 weeks)

Week 1
- Day 1–2: Finalize cases, set up smoke/API test harness; run first smoke
- Day 3–4: Implement API tests (Auth/Announcements), draft FE unit tests
- Day 5: First E2E skeleton (login + announcements create)

Week 2
- Day 1–2: Expand E2E, finalize UAT checklist, dry run
- Day 3–4: Fixes + re-test; coverage gap review
- Day 5: Sign-off & summary report

## 9. Reporting

- Daily: quick status (executed, pass rate, blockers)
- Defects: file GitHub issues with repro steps and logs
- Summary: at milestone end, list coverage and open risks

## 10. How to run (initial)

Smoke (backend):
```
cd backend
npm run test:smoke
```

UAT: follow tests/checklists/uat-checklist.md

Planned next: `npm test` for Jest (API) and `npm run e2e` for Cypress.
