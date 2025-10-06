# Functional Test Suite (36 Cases)

Note: Use the template in tests/templates/test-case-template.md. Below are ready-to-fill skeletons following the exact structure with a Test Data section.

## Auth (Admin) – 6 cases

1) Test Case ID: TC-AUTH-001
- Title: Admin login success
- Module/Feature: Auth
- Priority: P1
- Preconditions: Backend running at http://localhost:3000; admin frontend available
- Test Data: email=admin@augustinegrove.com, password=admin123
- Steps:
  1. Navigate to /login
  2. Enter valid email and password
  3. Click Login
- Expected Result: 200 OK; token stored; redirected to /announcements
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

2) Test Case ID: TC-AUTH-002
- Title: Admin login fails with wrong password
- Module/Feature: Auth
- Priority: P1
- Preconditions: Backend running
- Test Data: email=admin@augustinegrove.com, password=wrongpass
- Steps:
  1. Navigate to /login
  2. Enter email and wrong password
  3. Click Login
- Expected Result: 401 Unauthorized with error
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

3) Test Case ID: TC-AUTH-003
- Title: Admin login fails with missing fields
- Module/Feature: Auth
- Priority: P1
- Preconditions: Backend running
- Test Data: email="", password=""
- Steps:
  1. Navigate to /login
  2. Leave fields empty
  3. Click Login
- Expected Result: 400 validation error shown
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

4) TC-AUTH-004 – Unauthorized admin API without token
- Title: Access admin endpoint without token
- Module/Feature: Auth
- Priority: P1
- Preconditions: Backend running
- Test Data: None
- Steps:
  1. Call POST /api/admin/announcements without Authorization header
- Expected Result: 401 Unauthorized
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

5) TC-AUTH-005 – Authorized admin API with token
- Title: Access admin endpoint with valid token
- Module/Feature: Auth
- Priority: P1
- Preconditions: Valid token from /api/admin/login
- Test Data: token=<from login>
- Steps:
  1. Call GET /api/announcements with Bearer token
- Expected Result: 200 OK, array of announcements
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

6) TC-AUTH-006 – Token persistence
- Title: Token persists across page refresh
- Module/Feature: Auth
- Priority: P2
- Preconditions: Logged in; token in localStorage
- Test Data: N/A
- Steps:
  1. Refresh page
  2. Navigate to /announcements
- Expected Result: User remains authenticated; API calls succeed
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

## Announcements (Admin CRUD) – 14 cases

7) TC-ANN-001 – List announcements (admin)
- Title: List announcements returns data
- Module/Feature: Announcements
- Priority: P1
- Preconditions: Admin authenticated
- Test Data: token=<from login>
- Steps:
  1. GET /api/announcements with token
- Expected Result: 200 OK; array
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

8) TC-ANN-002 – Create valid announcement
- Title: Create with valid fields
- Module/Feature: Announcements
- Priority: P1
- Preconditions: Admin authenticated
- Test Data: title, description
- Steps:
  1. POST /api/admin/announcements with payload
- Expected Result: 201 Created with id
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

9) TC-ANN-003 – Create missing title
- Title: Missing title validation
- Module/Feature: Announcements
- Priority: P1
- Preconditions: Admin authenticated
- Test Data: description only
- Steps:
  1. POST without title
- Expected Result: 400 Bad Request
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

10) TC-ANN-004 – Create with long title
- Title: Long title validation
- Module/Feature: Announcements
- Priority: P2
- Preconditions: Admin authenticated
- Test Data: title length > allowed
- Steps:
  1. POST with very long title
- Expected Result: Rejected or truncated per rules
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

11) TC-ANN-005 – Edit announcement valid
- Title: Update fields succeeds
- Module/Feature: Announcements
- Priority: P1
- Preconditions: Existing announcement id
- Test Data: id=<created>, new title/description
- Steps:
  1. PUT /api/admin/announcements/:id
- Expected Result: 200 OK; updated record
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

12) TC-ANN-006 – Edit invalid id
- Title: Update invalid id fails
- Module/Feature: Announcements
- Priority: P1
- Preconditions: Non-existent id
- Test Data: id=999999
- Steps:
  1. PUT /api/admin/announcements/999999
- Expected Result: 404 Not Found
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

13) TC-ANN-007 – Delete announcement valid
- Title: Delete existing
- Module/Feature: Announcements
- Priority: P1
- Preconditions: Existing id
- Test Data: id=<created>
- Steps:
  1. DELETE /api/admin/announcements/:id
- Expected Result: 200/204; subsequent GET excludes item
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

14) TC-ANN-008 – Delete invalid id
- Title: Delete invalid id fails
- Module/Feature: Announcements
- Priority: P1
- Preconditions: None
- Test Data: id=999999
- Steps:
  1. DELETE /api/admin/announcements/999999
- Expected Result: 404 Not Found
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

15) TC-ANN-009 – Unauthorized create
- Title: Create without token
- Module/Feature: Announcements
- Priority: P1
- Preconditions: None
- Test Data: None
- Steps:
  1. POST /api/admin/announcements without Authorization header
- Expected Result: 401 Unauthorized
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

16) TC-ANN-010 – Image URL optional
- Title: Create without image_url
- Module/Feature: Announcements
- Priority: P2
- Preconditions: Admin authenticated
- Test Data: title, description, image_url=null
- Steps:
  1. POST with null image_url
- Expected Result: 201 Created; image_url null accepted
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

17) TC-ANN-011 – List ordering
- Title: Verify newest first ordering (if applicable)
- Module/Feature: Announcements
- Priority: P2
- Preconditions: Multiple records with timestamps
- Test Data: three announcements created at different times
- Steps:
  1. GET /api/announcements
- Expected Result: Sorted by created_at desc
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

18) TC-ANN-012 – Pagination/limit (if applicable)
- Title: Limit parameter works
- Module/Feature: Announcements
- Priority: P3
- Preconditions: 20+ items
- Test Data: limit=10
- Steps:
  1. GET /api/announcements?limit=10
- Expected Result: 10 items returned
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

19) TC-ANN-013 – Validation of HTML content (if rich text)
- Title: Rich text content persists/rendered
- Module/Feature: Announcements
- Priority: P2
- Preconditions: Editor supports HTML/markdown
- Test Data: description with markup
- Steps:
  1. Create announcement with formatted description
- Expected Result: Saved and displayed correctly
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

20) TC-ANN-014 – Security headers present
- Title: Helmet headers present on API
- Module/Feature: Announcements API
- Priority: P3
- Preconditions: Backend running
- Test Data: None
- Steps:
  1. GET /api/health and inspect headers
- Expected Result: Security headers exist (CSP, COOP, CORP)
- Actual Result:
- Status:
- Tester:
- Date Executed:
- Comments/Evidence:

## Resident View (Announcements) – 5 cases

21) TC-RES-001 – Resident sees latest announcements
- Module/Feature: Resident View
- Priority: P1
- Preconditions: Main frontend running
- Test Data: At least one announcement exists
- Steps:
  1. Open main frontend announcements section
- Expected Result: Announcements list visible
- Actual/Status/Tester/Date/Comments:

22) TC-RES-002 – Date and details formatting
- Priority: P1
- Preconditions: Announcement with date and long description
- Test Data: N/A
- Steps: View the item
- Expected: Correctly formatted date and trimmed text if applicable
- Actual/Status/Tester/Date/Comments:

23) TC-RES-003 – Placeholder image on missing URL
- Priority: P2
- Preconditions: Announcement with null image_url
- Steps: View item
- Expected: Placeholder image shown
- Actual/Status/Tester/Date/Comments:

24) TC-RES-004 – Empty state message
- Priority: P2
- Preconditions: No announcements
- Steps: Load page
- Expected: Friendly empty state
- Actual/Status/Tester/Date/Comments:

25) TC-RES-005 – Basic performance acceptable
- Priority: P2
- Steps: Measure fetch duration
- Expected: <500ms locally
- Actual/Status/Tester/Date/Comments:

## Navigation & Access Control – 4 cases

26) TC-NAV-001 – Admin routes require login
- Priority: P1
- Steps: Directly open /announcements without login
- Expected: Redirect to /login
- Actual/Status/Tester/Date/Comments:

27) TC-NAV-002 – Sidebar links navigate
- Priority: P2
- Steps: Click Announcements, Amenities, Gallery, Reports
- Expected: Correct pages load and highlight active link
- Actual/Status/Tester/Date/Comments:

28) TC-NAV-003 – Navbar renders correctly
- Priority: P2
- Steps: View navbar after login
- Expected: Shows expected items and user context (if any)
- Actual/Status/Tester/Date/Comments:

29) TC-NAV-004 – Unknown route handling
- Priority: P2
- Steps: Visit /does-not-exist
- Expected: Graceful handling (Navigate to /announcements)
- Actual/Status/Tester/Date/Comments:

## Gallery & Amenities – 4 cases

30) TC-CONTENT-001 – Gallery images render
31) TC-CONTENT-002 – Amenities sections load
32) TC-CONTENT-003 – Navigation between pages keeps layout
33) TC-CONTENT-004 – Responsive checks on desktop/mobile widths

(Use full template fields for each when executing.)

## API Presence: Reports/Concerns/Visitors – 3 cases

34) TC-API-001 – Endpoint responds (200)
35) TC-API-002 – Unauthorized access blocked (401)
36) TC-API-003 – Basic create/list schema validation

(Use Postman or small Node scripts; fill template fields when running.)
