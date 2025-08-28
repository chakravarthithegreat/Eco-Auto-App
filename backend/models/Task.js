const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'TASK' + Date.now().toString().slice(-6)
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true,
    enum: [
      'Trophy Production',
      'Award Manufacturing',
      'Custom Orders',
      'Quality Control',
      'Maintenance',
      'Inventory Management',
      'Customer Service',
      'Sales Support',
      'Marketing Campaign',
      'General Operations'
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Production',
      'Assembly',
      'Quality Check',
      'Packaging',
      'Shipping',
      'Maintenance',
      'Administrative',
      'Sales',
      'Marketing',
      'Customer Support'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date,
    default: null
  },
  estimatedHours: {
    type: Number,
    default: 0
  },
  actualHours: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String
  }],
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  cost: {
    estimated: Number,
    actual: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  location: {
    type: String,
    default: 'Main Factory'
  },
  equipment: [{
    type: String
  }],
  materials: [{
    name: String,
    quantity: Number,
    unit: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ project: 1, category: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ taskId: 1 });

module.exports = mongoose.model('Task', taskSchema);
