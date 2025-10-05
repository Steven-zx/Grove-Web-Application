const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

console.log('Starting server setup...');

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

console.log('Middleware configured...');

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Grove Backend API is running' 
  });
});

// Test announcements with static data
app.get('/api/announcements', (req, res) => {
  console.log('Announcements requested');
  const testAnnouncements = [
    {
      id: 1,
      title: "Pool Maintenance Notice",
      content: "The swimming pool will be closed for maintenance on December 15-16, 2024. We apologize for any inconvenience.",
      priority: "high",
      author: "Facilities Management",
      created_at: "2024-12-10T10:00:00Z"
    },
    {
      id: 2,
      title: "Holiday Schedule",
      content: "Please note the adjusted operating hours during the holiday season. The clubhouse will be open from 8 AM to 6 PM.",
      priority: "medium",
      author: "Administration",
      created_at: "2024-12-08T14:30:00Z"
    }
  ];
  
  res.json(testAnnouncements);
});

console.log('Routes configured...');

// Error handling
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

console.log('Starting server...');

// Start server
const server = app.listen(PORT, () => {
  console.log(`🌳 Grove Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📢 Announcements: http://localhost:${PORT}/api/announcements`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});