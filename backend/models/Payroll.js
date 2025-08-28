const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: {
    houseRent: {
      type: Number,
      default: 0
    },
    transport: {
      type: Number,
      default: 0
    },
    medical: {
      type: Number,
      default: 0
    },
    food: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  deductions: {
    pf: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    insurance: {
      type: Number,
      default: 0
    },
    loan: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  bonuses: {
    performance: {
      type: Number,
      default: 0
    },
    attendance: {
      type: Number,
      default: 0
    },
    production: {
      type: Number,
      default: 0
    },
    quality: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  overtime: {
    hours: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  attendance: {
    presentDays: {
      type: Number,
      default: 0
    },
    absentDays: {
      type: Number,
      default: 0
    },
    lateDays: {
      type: Number,
      default: 0
    },
    halfDays: {
      type: Number,
      default: 0
    }
  },
  grossSalary: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'cheque', 'upi'],
    default: 'bank_transfer'
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  remarks: {
    type: String,
    maxLength: 500
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for unique payroll per employee per month
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ paymentStatus: 1, month: 1, year: 1 });
payrollSchema.index({ employeeId: 1, year: -1, month: -1 });

// Calculate totals before saving
payrollSchema.pre('save', function(next) {
  // Calculate gross salary
  const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + (val || 0), 0);
  const totalBonuses = Object.values(this.bonuses).reduce((sum, val) => sum + (val || 0), 0);
  const totalOvertime = this.overtime.amount || 0;
  
  this.grossSalary = this.basicSalary + totalAllowances + totalBonuses + totalOvertime;
  
  // Calculate net salary
  const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + (val || 0), 0);
  this.netSalary = this.grossSalary - totalDeductions;
  
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
