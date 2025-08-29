import mongoose from 'mongoose';
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated'],
    default: 'active'
  }
}, {
  timestamps: true
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
  progress: { type: Number, default: 0, min: 0, max: 100 }
}, {
  timestamps: true
});

// Create models
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
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

const EmployeeAuth = mongoose.models.EmployeeAuth || mongoose.model('EmployeeAuth', employeeAuthSchema);

export default async function handler(event, context) {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers
    });
  }

  // Accept any method for now (for testing)
  console.log('Method received:', event.httpMethod);

  try {
    await connectToDatabase();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Task.deleteMany({});
    await EmployeeAuth.deleteMany({});
    
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
    
    // Create authentication records for employees
    const authRecords = [
      {
        employeeId: createdEmployees[0]._id, // Rajesh Kumar
        username: 'rajesh.kumar',
        password: 'password123',
        email: 'rajesh.kumar@artgifts.com',
        role: 'manager'
      },
      {
        employeeId: createdEmployees[1]._id, // Priya Sharma
        username: 'priya.sharma',
        password: 'password123',
        email: 'priya.sharma@artgifts.com',
        role: 'manager'
      },
      {
        employeeId: createdEmployees[2]._id, // Amit Patel
        username: 'amit.patel',
        password: 'password123',
        email: 'amit.patel@artgifts.com',
        role: 'employee'
      },
      {
        employeeId: createdEmployees[3]._id, // Sneha Reddy
        username: 'sneha.reddy',
        password: 'password123',
        email: 'sneha.reddy@artgifts.com',
        role: 'employee'
      },
      {
        employeeId: createdEmployees[4]._id, // Vikram Singh
        username: 'vikram.singh',
        password: 'password123',
        email: 'vikram.singh@artgifts.com',
        role: 'employee'
      }
    ];
    
    const createdAuthRecords = await EmployeeAuth.insertMany(authRecords);
    console.log(`✅ Created ${createdAuthRecords.length} authentication records`);
    
    console.log('✅ Database seeding completed successfully!');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Database seeded successfully',
      summary: {
        employees: createdEmployees.length,
        attendanceRecords: createdAttendance.length,
        tasks: createdTasks.length,
        authRecords: createdAuthRecords.length
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Seeding failed',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }
}
