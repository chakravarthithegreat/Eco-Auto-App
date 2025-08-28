const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'EMP' + Date.now().toString().slice(-6)
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Production',
      'Quality Control',
      'Assembly',
      'Packaging',
      'Warehouse',
      'Maintenance',
      'Engineering',
      'Management',
      'HR',
      'Finance',
      'Sales',
      'Marketing'
    ]
  },
  role: {
    type: String,
    required: true,
    enum: [
      'Production Worker',
      'Quality Inspector',
      'Assembly Technician',
      'Packaging Specialist',
      'Warehouse Operator',
      'Maintenance Technician',
      'Production Engineer',
      'Quality Manager',
      'Production Manager',
      'Plant Manager',
      'HR Manager',
      'Accountant',
      'Sales Representative',
      'Marketing Specialist',
      'General Manager',
      'CEO'
    ]
  },
  position: {
    type: String,
    required: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'flexible'],
    default: 'morning'
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  skills: [{
    type: String
  }],
  certifications: [{
    name: String,
    issuedDate: Date,
    expiryDate: Date
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
employeeSchema.index({ department: 1, role: 1, status: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
