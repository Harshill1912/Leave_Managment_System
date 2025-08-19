const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  leaveType: { type: String, enum: ['Casual', 'Sick', 'Unpaid'], default: 'Casual' },
  reason: { type: String, default: '' },
}, { timestamps: true });


leaveSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Leave', leaveSchema);
