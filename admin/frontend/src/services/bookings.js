// services/bookings.js
// Central place for admin bookings data access.
// Replace the mock implementations with real backend calls later.
// Expected backend endpoints (examples):
//   GET    /api/admin/bookings?amenity=clubhouse&page=1&pageSize=10
//   PATCH  /api/admin/bookings/:id { status }
// User-side (resident) creates a booking via something like:
//   POST   /api/bookings { amenityId, date, startTime, endTime, purpose, ... }
// After POST succeeds, the admin page can:
//   1. Use websocket / SSE push OR
//   2. Poll / refetch OR
//   3. Receive a broadcast via a channel
// For now we just return mock data immediately.

const MOCK_BOOKINGS = [
  {
    id: 1,
    name: 'John Smith',
    amenity: 'Swimming Pool',
    date: '2025-09-30',
    time: '8AM-12PM',
    userType: 'Resident',
    status: 'Accepted',
    address: 'Block 3, Lot 8, Phase 2',
    contact: '0912 345 6789',
    email: 'john.smith@gmail.com',
    purpose: 'Birthday Party',
    attendees: 50,
    notes: "We'll need extra chairs for the event.",
  },
  {
    id: 2,
    name: 'Juan Dela Cruz',
    amenity: 'Clubhouse',
    date: '2025-10-02',
    time: '12PM-6PM',
    userType: 'Guest',
    status: 'Pending',
    address: 'Block 9, Lot 10',
    contact: '0917 222 3333',
    email: 'juan.delacruz@example.com',
    purpose: 'Meeting',
    attendees: 20,
    notes: 'Projector needed.',
  },
  {
    id: 3,
    name: 'Maria Santos',
    amenity: 'Basketball Court',
    date: '2025-10-02',
    time: '12PM-6PM',
    userType: 'Guest',
    status: 'Cancelled',
    address: 'Phase 1, Block 5',
    contact: '0999 888 7777',
    email: 'maria.santos@example.com',
    purpose: 'Tournament',
    attendees: 12,
    notes: 'Rescheduled due to weather.',
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: 4 + i,
    name: `Sample User ${i + 1}`,
    amenity: ['Swimming Pool', 'Clubhouse', 'Basketball Court'][i % 3],
    date: '2025-10-0' + ((i % 9) + 3),
    time: '1PM-3PM',
    userType: i % 2 === 0 ? 'Resident' : 'Guest',
    status: ['Accepted', 'Pending', 'Cancelled'][i % 3],
    address: 'Sample Address',
    contact: '0900 111 2222',
    email: `sample${i + 1}@mail.com`,
    purpose: 'General Use',
    attendees: 10 + i,
    notes: '--',
  }))
];

// Simulated delay helper
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Fetch bookings (mock) — in real code you would fetch from backend
export async function fetchAdminBookings({ amenity = 'all', page = 1, pageSize = 10 }) {
  await delay(120); // simulate network
  let data = [...MOCK_BOOKINGS];
  if (amenity !== 'all') {
    const key = amenity.toLowerCase();
    data = data.filter(b => b.amenity.toLowerCase() === key);
  }
  const total = data.length; // For real backend this should be total BEFORE pagination if server handles it
  // Simple client-side pagination for mock
  const start = (page - 1) * pageSize;
  const pageItems = data.slice(start, start + pageSize);
  return { data: pageItems, total };
}

// Update booking status (mock). Real backend: PATCH request then return updated row.
export async function updateBookingStatus(id, status) {
  await delay(80);
  // Normally you'd return server response; we just echo.
  return { id, status };
}

// Delete bookings (bulk). Real backend: DELETE or POST to bulk endpoint.
export async function deleteBookings(ids) {
  await delay(100);
  return { deleted: ids };
}
