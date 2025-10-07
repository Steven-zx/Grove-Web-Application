# UAT Checklist – Grove Web Application

Date:
Participants: QA Lead, Product Owner, Dev Rep

## Admin Flows
- [ ] Admin can navigate to /login and sign in with valid creds
- [ ] Announcements page loads with existing items
- [ ] Create new announcement (title + description)
- [ ] Edit announcement text and save
- [ ] Delete an announcement and confirm removal
- [ ] Invalid input shows validation messages

## Resident Flows (Main Frontend)
- [ ] Homepage loads
- [ ] Announcements visible with correct ordering and formatting
- [ ] Gallery and Amenities pages render

## Cross-cutting
- [ ] Unauthorized API calls return 401
- [ ] CORS allows localhost ports (3000, 5173/4/6)
- [ ] Basic performance acceptable (<500ms for announcements list)

Notes/Issues:
