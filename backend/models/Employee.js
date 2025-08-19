const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  joiningDate: { type: Date, required: true },
  totalLeaves: { type: Number, default: 20 }, // Annual leave
  leavesTaken: { type: Number, default: 0 },
});

module.exports = mongoose.model('Employee', employeeSchema);
