const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
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
      enum: ['card_swipe', 'biometric', 'manual', 'mobile'],
      default: 'card_swipe'
    }
  },
  checkOut: {
    time: {
      type: Date,
      default: null
    },
    location: {
      type: String,
      default: 'Main Gate'
    },
    method: {
      type: String,
      enum: ['card_swipe', 'biometric', 'manual', 'mobile'],
      default: 'card_swipe'
    }
  },
  totalHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'on_leave'],
    default: 'present'
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    required: true
  },
  breakTime: {
    start: Date,
    end: Date,
    duration: Number // in minutes
  },
  notes: {
    type: String,
    maxLength: 500
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ employeeId: 1, date: -1 });

// Calculate total hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const checkInTime = new Date(this.checkIn.time);
    const checkOutTime = new Date(this.checkOut.time);
    const totalMs = checkOutTime - checkInTime;
    this.totalHours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
    
    // Calculate overtime (assuming 8 hours is standard)
    if (this.totalHours > 8) {
      this.overtimeHours = Math.round((this.totalHours - 8) * 100) / 100;
    }
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
