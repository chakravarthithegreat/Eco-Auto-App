const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:4173', // Vite preview default
    'https://artgifts.com', // Production domain
    'https://www.artgifts.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models
const Employee = require('./models/Employee');
const Task = require('./models/Task');
const Attendance = require('./models/Attendance');
const Payroll = require('./models/Payroll');

// Import data seeder
const { seedAllData } = require('./utils/seedData');

// Policies configuration
const policies = {
  leave: {
    paidLeavesAdvanceNotice: 2,
    advanceNoticeDays: 7,
    unnotifiedLeaveRatio: 0.5
  },
  attendance: {
    onTimeThreshold: '09:00',
    lateThreshold: '09:30',
    latePenalty: 50
  },
  payroll: {
    baseSalary: 50000,
    performanceBonus: 10000,
    attendanceBonus: 5000
  },
  rewards: {
    star: { value: 5, currency: 'INR' },
    butterfly: { value: 2.5, currency: 'INR' },
    chocolate: { value: 1.25, currency: 'INR' }
  }
};

// Import hiring routes
const hiringRoutes = require('./routes/hiringRoutes');

// Routes

// Hiring routes
app.use('/api/hiring', hiringRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eco-Auto App Backend is running' });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find employee by email
    const employee = await Employee.findOne({ email: email.toLowerCase() });
    
    if (employee) {
      // For now, accept any password for demo purposes
      // In production, implement proper password hashing and JWT
      const { __v, ...employeeWithoutVersion } = employee.toObject();
      
      // Map role based on position/department
      let role = 'TEAM_MEMBER';
      if (employee.position.includes('Manager') || employee.position.includes('CEO')) {
        role = 'MANAGER';
      }
      if (employee.position.includes('CEO') || employee.department === 'Management') {
        role = 'ADMIN';
      }
      
      res.json({
        success: true,
        user: {
          ...employeeWithoutVersion,
          role: role
        },
        token: `token-${employee._id}`
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Employee routes
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'active' }).select('-__v');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-__v');
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo', 'name email')
     .populate('assignedBy', 'name email');
    
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Project routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: projects.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Attendance routes
app.get('/api/attendance', async (req, res) => {
  try {
    const { employeeId, date, startDate, endDate } = req.query;
    let query = {};
    
    if (employeeId) query.employeeId = employeeId;
    if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
      };
    }
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name email employeeId')
      .select('-__v')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const newAttendance = new Attendance(req.body);
    const savedAttendance = await newAttendance.save();
    const populatedAttendance = await Attendance.findById(savedAttendance._id)
      .populate('employeeId', 'name email employeeId');
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Leave routes
app.get('/api/leaves', (req, res) => {
  res.json(leaves);
});

app.post('/api/leaves', (req, res) => {
  const newLeave = {
    id: leaves.length + 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  leaves.push(newLeave);
  res.status(201).json(newLeave);
});

// Rewards routes
app.get('/api/rewards', (req, res) => {
  res.json(rewards);
});

app.post('/api/rewards', (req, res) => {
  const newReward = {
    id: rewards.length + 1,
    ...req.body,
    earnedAt: new Date().toISOString()
  };
  rewards.push(newReward);
  res.status(201).json(newReward);
});

// Policy routes
app.get('/api/policies', (req, res) => {
  res.json(policies);
});

app.put('/api/policies', (req, res) => {
  policies = { ...policies, ...req.body };
  res.json(policies);
});

// Analytics routes
app.get('/api/analytics/dashboard', (req, res) => {
  const { role } = req.query;
  
  const analytics = {
    totalUsers: users.length,
    totalTasks: tasks.length,
    totalProjects: projects.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    todayAttendance: attendance.filter(a => 
      new Date(a.timestamp).toDateString() === new Date().toDateString()
    ).length,
    totalRewards: rewards.reduce((sum, r) => sum + (r.value || 0), 0)
  };
  
  res.json(analytics);
});

// Dashboard widget endpoints with real data
app.get('/api/dashboard/hours', async (req, res) => {
  try {
    const last28Days = Array.from({ length: 28 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (27 - i));
      return date.toISOString().split('T')[0];
    });

    const attendanceData = await Attendance.find({
      date: {
        $gte: new Date(last28Days[0]),
        $lte: new Date(last28Days[27])
      }
    }).populate('employeeId', 'name');

    const series = last28Days.map(date => {
      const dayAttendance = attendanceData.filter(a => 
        a.date.toISOString().split('T')[0] === date
      );
      const totalHours = dayAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
      const avgHours = dayAttendance.length > 0 ? totalHours / dayAttendance.length : 0;
      
      return {
        date: date,
        hours: Math.round(avgHours * 10) / 10
      };
    });

    const avg = Math.round((series.reduce((s, p) => s + p.hours, 0) / series.length) * 10) / 10;
    res.json({ average: avg, deltaPct: 2.1, series });
  } catch (error) {
    console.error('Error fetching hours data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/dashboard/team-split', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'active' });
    const totalEmployees = employees.length;
    
    // Simulate onsite/remote split based on department
    const onsiteDepartments = ['Production', 'Assembly', 'Quality Control', 'Packaging', 'Warehouse', 'Maintenance'];
    const onsiteCount = employees.filter(emp => onsiteDepartments.includes(emp.department)).length;
    const remoteCount = totalEmployees - onsiteCount;
    
    const onsitePct = Math.round((onsiteCount / totalEmployees) * 100);
    const remotePct = 100 - onsitePct;
    
    res.json({ 
      onsite: { pct: onsitePct, deltaPct: 1.2 }, 
      remote: { pct: remotePct, deltaPct: -1.2 } 
    });
  } catch (error) {
    console.error('Error fetching team split:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/dashboard/team-composition', async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'active' });
    
    const roleCounts = employees.reduce((acc, emp) => {
      acc[emp.role] = (acc[emp.role] || 0) + 1;
      return acc;
    }, {});
    
    const composition = Object.entries(roleCounts).map(([role, count]) => ({
      role: role,
      count: count
    }));
    
    res.json(composition);
  } catch (error) {
    console.error('Error fetching team composition:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/hiring/pipeline', async (req, res) => {
  try {
    // For now, return realistic manufacturing hiring pipeline data
    res.json([
      { stage: 'Applied', matched: 45, notMatched: 12 },
      { stage: 'Interview', matched: 18, notMatched: 8 },
      { stage: 'Offer', matched: 5, notMatched: 1 },
    ]);
  } catch (error) {
    console.error('Error fetching hiring pipeline:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/payroll/payouts', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const payrolls = await Payroll.find({ 
      month: currentMonth, 
      year: currentYear 
    }).populate('employeeId', 'name');
    
    const payouts = payrolls.map((payroll, index) => ({
      id: index + 1,
      name: payroll.employeeId.name,
      amount: payroll.netSalary,
      date: payroll.paymentStatus === 'paid' ? 'Today' : 'Pending',
      status: payroll.paymentStatus === 'paid' ? 'Done' : 'Waiting'
    }));
    
    res.json(payouts);
  } catch (error) {
    console.error('Error fetching payroll payouts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/payroll/summary', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const payrolls = await Payroll.find({ 
      month: currentMonth, 
      year: currentYear 
    });
    
    const totalBase = payrolls.reduce((sum, p) => sum + p.basicSalary, 0);
    const totalPerformance = payrolls.reduce((sum, p) => sum + p.bonuses.performance, 0);
    const totalGift = payrolls.reduce((sum, p) => sum + p.bonuses.other, 0);
    const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    
    res.json({ 
      base: totalBase, 
      performance: totalPerformance, 
      gift: totalGift, 
      total: totalNet 
    });
  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Data seeding endpoint (for development only)
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/seed', async (req, res) => {
    try {
      await seedAllData();
      res.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Seeding error:', error);
      res.status(500).json({ success: false, message: 'Seeding failed' });
    }
  });
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Artgifts Manufacturing App Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  
  // Auto-seed data in development
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('🌱 Auto-seeding database...');
      await seedAllData();
      console.log('✅ Database seeded successfully!');
    } catch (error) {
      console.log('⚠️ Auto-seeding failed, but server is running');
    }
  }
});

module.exports = app;