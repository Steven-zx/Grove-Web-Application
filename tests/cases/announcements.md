# Announcements – Test Cases

## TC-ANN-001 – Admin login succeeds (P1)
- Component: Auth
- Preconditions: Backend running; admin creds available
- Steps:
  1. POST /api/admin/login with valid credentials
  2. Verify 200 and token present
- Expected: 200 OK, token returned

## TC-ANN-002 – List announcements as admin (P1)
- Component: Announcements API
- Steps: GET /api/announcements with Authorization: Bearer <token>
- Expected: 200 OK, array of announcements

## TC-ANN-003 – Create announcement valid (P1)
- Steps: POST /api/admin/announcements with title, description
- Expected: 201 Created, record returned with id

## TC-ANN-004 – Create announcement missing title (P1)
- Steps: POST with missing/empty title
- Expected: 400 Bad Request with validation message

## TC-ANN-005 – Edit announcement (P2)
- Steps: PUT /api/admin/announcements/:id with updated fields
- Expected: 200 OK, updated record

## TC-ANN-006 – Delete announcement (P1)
- Steps: DELETE /api/admin/announcements/:id
- Expected: 200 OK or 204 No Content; subsequent GET no longer includes item

## TC-ANN-007 – Unauthorized create (P1)
- Steps: POST without token
- Expected: 401 Unauthorized

## TC-ANN-008 – Resident view announcements (P2)
- Steps: Open main frontend and verify list renders and images load
- Expected: Latest announcements visible, dates and details formatted

## TC-ANN-009 – Performance basic (P3)
- Steps: Measure GET /api/announcements response time under 500ms (local)
- Expected: Median < 500ms
