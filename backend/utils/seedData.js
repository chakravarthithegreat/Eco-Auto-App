const Employee = require('../models/Employee');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');

const seedEmployees = async () => {
  const employees = [
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@artgifts.com',
      phone: '+91-9876543210',
      department: 'Production',
      role: 'Production Manager',
      position: 'Senior Production Manager',
      salary: 75000,
      shift: 'morning',
      skills: ['Production Planning', 'Quality Control', 'Team Management'],
      emergencyContact: {
        name: 'Priya Kumar',
        relationship: 'Wife',
        phone: '+91-9876543211'
      },
      address: {
        street: '123 Industrial Area',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@artgifts.com',
      phone: '+91-9876543212',
      department: 'Quality Control',
      role: 'Quality Manager',
      position: 'Quality Control Manager',
      salary: 65000,
      shift: 'morning',
      skills: ['Quality Assurance', 'ISO Standards', 'Inspection'],
      emergencyContact: {
        name: 'Amit Sharma',
        relationship: 'Husband',
        phone: '+91-9876543213'
      },
      address: {
        street: '456 Quality Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400002',
        country: 'India'
      }
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@artgifts.com',
      phone: '+91-9876543214',
      department: 'Assembly',
      role: 'Assembly Technician',
      position: 'Senior Assembly Technician',
      salary: 45000,
      shift: 'morning',
      skills: ['Trophy Assembly', 'Equipment Operation', 'Safety Protocols'],
      emergencyContact: {
        name: 'Neha Patel',
        relationship: 'Sister',
        phone: '+91-9876543215'
      },
      address: {
        street: '789 Assembly Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400003',
        country: 'India'
      }
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@artgifts.com',
      phone: '+91-9876543216',
      department: 'Packaging',
      role: 'Packaging Specialist',
      position: 'Packaging Team Lead',
      salary: 40000,
      shift: 'afternoon',
      skills: ['Packaging Design', 'Material Handling', 'Inventory Management'],
      emergencyContact: {
        name: 'Krishna Reddy',
        relationship: 'Father',
        phone: '+91-9876543217'
      },
      address: {
        street: '321 Packaging Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400004',
        country: 'India'
      }
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@artgifts.com',
      phone: '+91-9876543218',
      department: 'Warehouse',
      role: 'Warehouse Operator',
      position: 'Warehouse Supervisor',
      salary: 42000,
      shift: 'morning',
      skills: ['Inventory Management', 'Forklift Operation', 'Logistics'],
      emergencyContact: {
        name: 'Gurpreet Singh',
        relationship: 'Brother',
        phone: '+91-9876543219'
      },
      address: {
        street: '654 Warehouse Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400005',
        country: 'India'
      }
    },
    {
      name: 'Anjali Desai',
      email: 'anjali.desai@artgifts.com',
      phone: '+91-9876543220',
      department: 'Engineering',
      role: 'Production Engineer',
      position: 'Senior Production Engineer',
      salary: 70000,
      shift: 'morning',
      skills: ['Process Optimization', 'CAD Design', 'Manufacturing Engineering'],
      emergencyContact: {
        name: 'Rahul Desai',
        relationship: 'Husband',
        phone: '+91-9876543221'
      },
      address: {
        street: '987 Engineering Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400006',
        country: 'India'
      }
    },
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@artgifts.com',
      phone: '+91-9876543222',
      department: 'Maintenance',
      role: 'Maintenance Technician',
      position: 'Senior Maintenance Technician',
      salary: 48000,
      shift: 'night',
      skills: ['Equipment Maintenance', 'Troubleshooting', 'Preventive Maintenance'],
      emergencyContact: {
        name: 'Sunita Verma',
        relationship: 'Mother',
        phone: '+91-9876543223'
      },
      address: {
        street: '147 Maintenance Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400007',
        country: 'India'
      }
    },
    {
      name: 'Meera Iyer',
      email: 'meera.iyer@artgifts.com',
      phone: '+91-9876543224',
      department: 'Management',
      role: 'Plant Manager',
      position: 'Plant Manager',
      salary: 85000,
      shift: 'morning',
      skills: ['Operations Management', 'Strategic Planning', 'Team Leadership'],
      emergencyContact: {
        name: 'Arun Iyer',
        relationship: 'Husband',
        phone: '+91-9876543225'
      },
      address: {
        street: '258 Management Heights',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400008',
        country: 'India'
      }
    },
    {
      name: 'Karan Malhotra',
      email: 'karan.malhotra@artgifts.com',
      phone: '+91-9876543226',
      department: 'Sales',
      role: 'Sales Representative',
      position: 'Senior Sales Representative',
      salary: 55000,
      shift: 'flexible',
      skills: ['Customer Relations', 'Sales Strategy', 'Product Knowledge'],
      emergencyContact: {
        name: 'Pooja Malhotra',
        relationship: 'Wife',
        phone: '+91-9876543227'
      },
      address: {
        street: '369 Sales Plaza',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400009',
        country: 'India'
      }
    },
    {
      name: 'Divya Gupta',
      email: 'divya.gupta@artgifts.com',
      phone: '+91-9876543228',
      department: 'HR',
      role: 'HR Manager',
      position: 'Human Resources Manager',
      salary: 60000,
      shift: 'morning',
      skills: ['Employee Relations', 'Recruitment', 'HR Policies'],
      emergencyContact: {
        name: 'Ravi Gupta',
        relationship: 'Husband',
        phone: '+91-9876543229'
      },
      address: {
        street: '741 HR Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400010',
        country: 'India'
      }
    }
  ];

  try {
    // Clear existing employees
    await Employee.deleteMany({});
    
    // Insert new employees with unique employeeId generation
    const employeesWithUniqueIds = employees.map((emp, index) => ({
      ...emp,
      employeeId: `EMP${Date.now()}${index}`
    }));
    
    const createdEmployees = await Employee.insertMany(employeesWithUniqueIds);
    console.log(`✅ Seeded ${createdEmployees.length} employees`);
    
    return createdEmployees;
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    throw error;
  }
};

const seedTasks = async (employees) => {
  const tasks = [
    {
      title: 'Trophy Production Batch #2024-001',
      description: 'Manufacture 500 custom trophies for annual sports event',
      project: 'Trophy Production',
      category: 'Production',
      priority: 'high',
      status: 'in_progress',
      assignedTo: [employees[0]._id, employees[2]._id],
      assignedBy: employees[7]._id, // Plant Manager
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      estimatedHours: 40,
      actualHours: 25,
      progress: 60,
      tags: ['urgent', 'custom', 'sports'],
      location: 'Production Floor A',
      equipment: ['CNC Machine', 'Polishing Equipment', 'Engraving Machine'],
      materials: [
        { name: 'Brass Sheets', quantity: 50, unit: 'kg' },
        { name: 'Wood Base', quantity: 500, unit: 'pieces' },
        { name: 'Engraving Plates', quantity: 500, unit: 'pieces' }
      ]
    },
    {
      title: 'Quality Inspection - Award Series',
      description: 'Conduct quality checks on 200 award pieces',
      project: 'Quality Control',
      category: 'Quality Check',
      priority: 'medium',
      status: 'pending',
      assignedTo: [employees[1]._id],
      assignedBy: employees[7]._id,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 16,
      actualHours: 0,
      progress: 0,
      tags: ['quality', 'inspection', 'awards'],
      location: 'Quality Lab',
      equipment: ['Microscope', 'Measuring Tools', 'Quality Standards'],
      materials: [
        { name: 'Award Pieces', quantity: 200, unit: 'pieces' }
      ]
    },
    {
      title: 'Equipment Maintenance - Assembly Line',
      description: 'Perform preventive maintenance on assembly line equipment',
      project: 'Maintenance',
      category: 'Maintenance',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: [employees[6]._id],
      assignedBy: employees[7]._id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      actualHours: 4,
      progress: 50,
      tags: ['maintenance', 'preventive', 'assembly'],
      location: 'Assembly Line B',
      equipment: ['Assembly Conveyor', 'Welding Machine', 'Testing Equipment'],
      materials: [
        { name: 'Lubricant', quantity: 5, unit: 'liters' },
        { name: 'Replacement Parts', quantity: 10, unit: 'pieces' }
      ]
    }
  ];

  try {
    await Task.deleteMany({});
    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Seeded ${createdTasks.length} tasks`);
    return createdTasks;
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    throw error;
  }
};

const seedAttendance = async (employees) => {
  const attendanceRecords = [];
  const today = new Date();
  
  // Generate attendance for last 30 days for each employee
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    for (const employee of employees) {
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
            method: 'card_swipe'
          },
          checkOut: {
            time: checkOutTime,
            location: 'Main Gate',
            method: 'card_swipe'
          },
          shift: employee.shift,
          status: 'present'
        });
      }
    }
  }

  try {
    await Attendance.deleteMany({});
    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Seeded ${createdAttendance.length} attendance records`);
    return createdAttendance;
  } catch (error) {
    console.error('❌ Error seeding attendance:', error);
    throw error;
  }
};

const seedPayroll = async (employees) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const payrollRecords = employees.map(employee => ({
    employeeId: employee._id,
    month: currentMonth,
    year: currentYear,
    basicSalary: employee.salary,
    allowances: {
      houseRent: Math.round(employee.salary * 0.1),
      transport: Math.round(employee.salary * 0.05),
      medical: Math.round(employee.salary * 0.03),
      food: Math.round(employee.salary * 0.02)
    },
    deductions: {
      pf: Math.round(employee.salary * 0.12),
      tax: Math.round(employee.salary * 0.05),
      insurance: Math.round(employee.salary * 0.02)
    },
    bonuses: {
      performance: Math.round(employee.salary * 0.1),
      attendance: Math.round(employee.salary * 0.05)
    },
    overtime: {
      hours: Math.floor(Math.random() * 20),
      rate: Math.round(employee.salary / 160), // Assuming 160 hours per month
      amount: Math.round(employee.salary * 0.05)
    },
    attendance: {
      presentDays: Math.floor(Math.random() * 5) + 20, // 20-25 days
      absentDays: Math.floor(Math.random() * 3),
      lateDays: Math.floor(Math.random() * 5),
      halfDays: Math.floor(Math.random() * 2)
    },
    paymentStatus: 'pending'
  }));

  try {
    await Payroll.deleteMany({});
    const createdPayroll = await Payroll.insertMany(payrollRecords);
    console.log(`✅ Seeded ${createdPayroll.length} payroll records`);
    return createdPayroll;
  } catch (error) {
    console.error('❌ Error seeding payroll:', error);
    throw error;
  }
};

const seedAllData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    const employees = await seedEmployees();
    const tasks = await seedTasks(employees);
    const attendance = await seedAttendance(employees);
    const payroll = await seedPayroll(employees);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Employees: ${employees.length}`);
    console.log(`   - Tasks: ${tasks.length}`);
    console.log(`   - Attendance Records: ${attendance.length}`);
    console.log(`   - Payroll Records: ${payroll.length}`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

module.exports = {
  seedAllData,
  seedEmployees,
  seedTasks,
  seedAttendance,
  seedPayroll
};
