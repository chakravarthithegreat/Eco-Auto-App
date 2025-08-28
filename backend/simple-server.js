const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));
app.use(express.json());

// Mock data
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@ecoauto.com',
    department: 'Management'
  },
  {
    id: 2,
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User',
    email: 'manager@ecoauto.com',
    department: 'Operations'
  },
  {
    id: 3,
    username: 'member',
    password: 'member123',
    role: 'team_member',
    name: 'Team Member',
    email: 'member@ecoauto.com',
    department: 'Development'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eco-Auto App Backend is running' });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: `mock-token-${user.id}`
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Eco-Auto App Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;