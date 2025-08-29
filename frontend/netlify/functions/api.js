import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artgifts_manufacturing');
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Express app setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Eco-Auto App Backend is running on Netlify Functions',
    timestamp: new Date().toISOString()
  });
});

// Attendance schema
const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shift: {
    type: String,
    default: 'morning'
  },
  checkIn: {
    time: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      default: 'Main Gate'
    },
    method: {
      type: String,
      enum: ['mobile', 'web', 'manual'],
      default: 'web'
    }
  },
  checkOut: {
    time: Date,
    location: String,
    method: {
      type: String,
      enum: ['mobile', 'web', 'manual']
    }
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Attendance indexes
attendanceSchema.index({ employeeId: 1, date: 1, shift: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ employeeId: 1, date: -1 });

// Attendance model
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

// Employee schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  emergencyContact: {
    name: String,
    phoneNumber: String,
    relationship: String
  },
  idProof: {
    type: String,
    number: { type: String, required: true },
    expiryDate: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated'],
    default: 'active'
  },
  image: String
}, {
  timestamps: true
});

// Employee indexes
employeeSchema.index({ email: 1 }, { unique: true });
employeeSchema.index({ phoneNumber: 1 });
employeeSchema.index({ department: 1 });

// Employee model
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

// Attendance routes
app.get('/api/attendance', async (req, res) => {
  try {
    await connectToDatabase();
    const attendanceRecords = await Attendance.find()
      .populate('employeeId', 'name email')
      .sort({ date: -1 });
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    await connectToDatabase();

    const { employeeId, date, checkIn, shift = 'morning' } = req.body;

    if (!employeeId || !date || !checkIn?.time) {
      return res.status(400).json({
        error: 'Missing required fields: employeeId, date, checkIn.time'
      });
    }

    const attendanceRecord = new Attendance({
      employeeId,
      date: new Date(date),
      shift,
      checkIn: {
        time: new Date(checkIn.time),
        location: checkIn.location || 'Main Gate',
        method: checkIn.method || 'web'
      },
      status: 'present'
    });

    const savedRecord = await attendanceRecord.save();
    const populatedRecord = await Attendance.findById(savedRecord._id)
      .populate('employeeId', 'name email');

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Error creating attendance:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Attendance record already exists for this employee on this date and shift'
      });
    }

    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

app.put('/api/attendance/:id', async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.params;
    const updateData = req.body;

    if (updateData.checkOut?.time) {
      updateData.checkOut.time = new Date(updateData.checkOut.time);
    }

    if (updateData.totalHours !== undefined) {
      updateData.totalHours = parseFloat(updateData.totalHours);
    }

    const updatedRecord = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email');

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

// Employee routes
app.get('/api/employees', async (req, res) => {
  try {
    await connectToDatabase();
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Payroll routes
app.get('/api/payroll/summary', async (req, res) => {
  try {
    await connectToDatabase();

    const employees = await Employee.find({ status: 'active' });

    const payrollSummary = employees.map(employee => ({
      id: employee._id,
      name: employee.name,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      status: 'Paid'
    }));

    res.json(payrollSummary);
  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    res.status(500).json({ error: 'Failed to fetch payroll summary' });
  }
});

// Task schema
const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  project: String,
  category: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  dueDate: Date,
  completedDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  progress: { type: Number, min: 0, max: 100, default: 0 },
  tags: [String],
  qualityScore: Number,
  cost: {
    estimated: Number,
    actual: Number
  },
  location: String,
  equipment: [String],
  materials: [String],
  attachments: [String],
  comments: [{
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Task indexes
taskSchema.index({ taskId: 1 }, { unique: true });
taskSchema.index({ status: 1 });
taskSchema.index({ assignedTo: 1 });

// Task model
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// EmployeeAuth schema
const employeeAuthSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    default: 'employee'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// EmployeeAuth indexes
employeeAuthSchema.index({ username: 1 });
employeeAuthSchema.index({ email: 1 });
employeeAuthSchema.index({ employeeId: 1 });

// EmployeeAuth model
const EmployeeAuth = mongoose.models.EmployeeAuth || mongoose.model('EmployeeAuth', employeeAuthSchema);

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    await connectToDatabase();
    const tasks = await Task.find()
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Seed data endpoint (for development/testing)
app.post('/api/seed', async (req, res) => {
  try {
    await connectToDatabase();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Task.deleteMany({});
    
    // Create sample employees
    const employees = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@artgifts.com',
        phoneNumber: '+91-9876543210',
        department: 'Production',
        position: 'Senior Production Manager',
        hireDate: new Date('2023-01-15'),
        salary: 75000,
        address: {
          street: '123 Industrial Area',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        emergencyContact: {
          name: 'Priya Kumar',
          phoneNumber: '+91-9876543211',
          relationship: 'Wife'
        },
        status: 'active'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@artgifts.com',
        phoneNumber: '+91-9876543212',
        department: 'Quality Control',
        position: 'Quality Control Manager',
        hireDate: new Date('2023-02-20'),
        salary: 65000,
        address: {
          street: '456 Quality Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002'
        },
        emergencyContact: {
          name: 'Amit Sharma',
          phoneNumber: '+91-9876543213',
          relationship: 'Husband'
        },
        status: 'active'
      },
      {
        name: 'Amit Patel',
        email: 'amit.patel@artgifts.com',
        phoneNumber: '+91-9876543214',
        department: 'Assembly',
        position: 'Senior Assembly Technician',
        hireDate: new Date('2023-03-10'),
        salary: 45000,
        address: {
          street: '789 Assembly Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400003'
        },
        emergencyContact: {
          name: 'Neha Patel',
          phoneNumber: '+91-9876543215',
          relationship: 'Sister'
        },
        status: 'active'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@artgifts.com',
        phoneNumber: '+91-9876543216',
        department: 'Packaging',
        position: 'Packaging Team Lead',
        hireDate: new Date('2023-04-05'),
        salary: 40000,
        address: {
          street: '321 Packaging Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400004'
        },
        emergencyContact: {
          name: 'Krishna Reddy',
          phoneNumber: '+91-9876543217',
          relationship: 'Father'
        },
        status: 'active'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@artgifts.com',
        phoneNumber: '+91-9876543218',
        department: 'Warehouse',
        position: 'Warehouse Supervisor',
        hireDate: new Date('2023-05-12'),
        salary: 42000,
        address: {
          street: '654 Warehouse Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400005'
        },
        emergencyContact: {
          name: 'Gurpreet Singh',
          phoneNumber: '+91-9876543219',
          relationship: 'Brother'
        },
        status: 'active'
      }
    ];
    
    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ Created ${createdEmployees.length} employees`);
    
    // Create sample attendance records for the last 7 days
    const attendanceRecords = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      for (const employee of createdEmployees) {
        const isPresent = Math.random() > 0.1; // 90% attendance rate
        
        if (isPresent) {
          const checkInTime = new Date(date);
          checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          
          const checkOutTime = new Date(date);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
          
          attendanceRecords.push({
            employeeId: employee._id,
            date: date,
            checkIn: {
              time: checkInTime,
              location: 'Main Gate',
              method: 'web'
            },
            checkOut: {
              time: checkOutTime,
              location: 'Main Gate',
              method: 'web'
            },
            shift: 'morning',
            status: 'present',
            totalHours: 8.5,
            overtimeHours: 0.5
          });
        }
      }
    }
    
    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${createdAttendance.length} attendance records`);
    
    // Create sample tasks
    const tasks = [
      {
        taskId: 'TASK-001',
        title: 'Trophy Production Batch #2024-001',
        description: 'Manufacture 500 custom trophies for annual sports event',
        project: 'Trophy Production',
        category: 'Production',
        priority: 'high',
        status: 'in_progress',
        assignedTo: [createdEmployees[0]._id, createdEmployees[2]._id],
        assignedBy: createdEmployees[1]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 40,
        actualHours: 25,
        progress: 60
      },
      {
        taskId: 'TASK-002',
        title: 'Quality Inspection - Award Series',
        description: 'Conduct quality checks on 200 award pieces',
        project: 'Quality Control',
        category: 'Quality Check',
        priority: 'medium',
        status: 'pending',
        assignedTo: [createdEmployees[1]._id],
        assignedBy: createdEmployees[0]._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedHours: 16,
        actualHours: 0,
        progress: 0
      }
    ];
    
    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Created ${createdTasks.length} tasks`);
    
    console.log('✅ Database seeding completed successfully!');
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      summary: {
        employees: createdEmployees.length,
        attendanceRecords: createdAttendance.length,
        tasks: createdTasks.length
      }
    });
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    await connectToDatabase();

    const taskData = {
      ...req.body,
      taskId: `TASK${Date.now().toString().slice(-6)}`
    };

    const task = new Task(taskData);
    const savedTask = await task.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignedTo', 'name')
      .populate('assignedBy', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);

    if (error.code === 11000) {
      return res.status(409).json({ error: 'Task ID already exists' });
    }

    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    // Find user by username or email
    const userAuth = await EmployeeAuth.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    }).populate('employeeId', 'name email department position');
    
    if (!userAuth) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    if (!userAuth.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }
    
    // Check if account is locked
    if (userAuth.lockUntil && userAuth.lockUntil > Date.now()) {
      return res.status(423).json({ 
        success: false, 
        message: 'Account is temporarily locked due to too many failed attempts' 
      });
    }
    
    // For demo purposes, we'll use a simple password check
    // In production, you should use bcrypt.compare()
    const isValidPassword = password === 'password123'; // Demo password
    
    if (!isValidPassword) {
      // Increment login attempts
      userAuth.loginAttempts += 1;
      if (userAuth.loginAttempts >= 5) {
        userAuth.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // Lock for 2 hours
      }
      await userAuth.save();
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Reset login attempts on successful login
    userAuth.loginAttempts = 0;
    userAuth.lockUntil = null;
    userAuth.lastLogin = new Date();
    await userAuth.save();
    
    // Create a simple token (in production, use JWT)
    const token = `demo_token_${userAuth._id}_${Date.now()}`;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userAuth.employeeId._id,
          name: userAuth.employeeId.name,
          email: userAuth.employeeId.email,
          department: userAuth.employeeId.department,
          position: userAuth.employeeId.position,
          role: userAuth.role
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { username, email, password, employeeId } = req.body;
    
    if (!username || !email || !password || !employeeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Check if username or email already exists
    const existingUser = await EmployeeAuth.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }
    
    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }
    
    // Create new auth record
    const userAuth = new EmployeeAuth({
      employeeId,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save middleware
      role: 'employee' // Default role
    });
    
    await userAuth.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: userAuth._id,
        username: userAuth.username,
        email: userAuth.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    await connectToDatabase();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    // For demo purposes, extract user ID from token
    // In production, verify JWT token
    const tokenParts = token.split('_');
    if (tokenParts.length < 3) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    const userId = tokenParts[2];
    const userAuth = await EmployeeAuth.findById(userId).populate('employeeId');
    
    if (!userAuth) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        id: userAuth.employeeId._id,
        name: userAuth.employeeId.name,
        email: userAuth.employeeId.email,
        department: userAuth.employeeId.department,
        position: userAuth.employeeId.position,
        role: userAuth.role
      }
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication check failed' 
    });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.params;
    const updateData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name')
     .populate('assignedBy', 'name');

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Auth routes (basic implementation)
app.post('/api/auth/login', async (req, res) => {
  try {
    await connectToDatabase();

    const { email, password } = req.body;

    // Simple demo authentication - in production, use proper auth
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, accept any password
    const token = `demo-token-${employee._id}-${Date.now()}`;

    res.json({
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.position === 'Manager' ? 'MANAGER' : 'TEAM_MEMBER'
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Dashboard routes
app.get('/api/dashboard/hours', async (req, res) => {
  try {
    await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = await Attendance.find({
      date: today,
      status: 'present'
    }).populate('employeeId', 'name department');

    const totalHours = attendanceRecords.reduce((sum, record) => {
      return sum + (record.totalHours || 0);
    }, 0);

    res.json({
      totalHours: Math.round(totalHours * 100) / 100,
      activeEmployees: attendanceRecords.length
    });
  } catch (error) {
    console.error('Error fetching hours:', error);
    res.status(500).json({ error: 'Failed to fetch hours data' });
  }
});

app.get('/api/dashboard/team-split', async (req, res) => {
  try {
    await connectToDatabase();

    const employees = await Employee.find({ status: 'active' });
    const departments = {};

    employees.forEach(employee => {
      const dept = employee.department || 'Other';
      departments[dept] = (departments[dept] || 0) + 1;
    });

    res.json(departments);
  } catch (error) {
    console.error('Error fetching team split:', error);
    res.status(500).json({ error: 'Failed to fetch team split data' });
  }
});

// Leave schema
const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String, enum: ['annual', 'sick', 'maternity', 'paternity', 'emergency'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  approvedDate: Date,
  comments: String
}, {
  timestamps: true
});

// Leave model
const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

// Leave routes
app.get('/api/leaves', async (req, res) => {
  try {
    await connectToDatabase();
    const leaves = await Leave.find()
      .populate('employeeId', 'name email department')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    await connectToDatabase();

    const leave = new Leave(req.body);
    const savedLeave = await leave.save();
    const populatedLeave = await Leave.findById(savedLeave._id)
      .populate('employeeId', 'name email department')
      .populate('approvedBy', 'name');

    res.status(201).json(populatedLeave);
  } catch (error) {
    console.error('Error creating leave:', error);
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

// Export the handler for Netlify Functions
export default async (req, context) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    // Create a proper request/response for Express
    const url = new URL(req.url);
    const path = url.pathname.replace('/.netlify/functions/api', '') || '/';

    const mockReq = {
      method: req.method,
      url: path,
      originalUrl: path,
      baseUrl: '',
      path: path,
      headers: req.headers,
      body: req.body,
      params: {},
      query: Object.fromEntries(url.searchParams)
    };

    // Extract route parameters
    const pathParts = path.split('/').filter(p => p);
    if (pathParts.length > 1) {
      mockReq.params.id = pathParts[1];
    }

    let responseData = null;
    let statusCode = 200;
    let headersSent = false;

    // Mock response object
    const mockRes = {
      json: (data) => {
        if (headersSent) return;
        responseData = data;
        headersSent = true;
      },
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            if (headersSent) return;
            responseData = data;
            headersSent = true;
          }
        };
      },
      send: (data) => {
        if (headersSent) return;
        responseData = data;
        headersSent = true;
      },
      setHeader: () => {},
      headersSent: false
    };

    // Route the request through Express
    await routeRequest(mockReq, mockRes);

    return new Response(JSON.stringify(responseData), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

// Simple routing function
async function routeRequest(req, res) {
  const path = req.url;
  const method = req.method;

  try {
    console.log(`Routing request: ${method} ${path}`);

    // Use Express app to handle routing directly
    // Set up the request object for Express
    req.originalUrl = req.url;
    req.baseUrl = '';
    req.path = req.url;

    // Let Express handle the routing
    app(req, res);

  } catch (error) {
    console.error('Routing error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
