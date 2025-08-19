const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Apply for leave
router.post('/apply', async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.body;

    const missingFields = [];
    if (!employeeId) missingFields.push('employeeId');
    if (!startDate) missingFields.push('startDate');
    if (!endDate) missingFields.push('endDate');
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields', missingFields });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return res.status(400).json({ success: false, error: 'Invalid date format' });
    if (start < new Date(employee.joiningDate)) {
      return res.status(400).json({ success: false, error: 'Cannot apply leave before joining date' });
    }
    if (end < start) return res.status(400).json({ success: false, error: 'End date cannot be before start date' });

    // Fix overlapping condition
    const overlapping = await Leave.findOne({
      employeeId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } } // overlap check
      ],
    });
    if (overlapping) return res.status(400).json({ success: false, error: 'Overlapping leave exists' });

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const remaining = employee.totalLeaves - employee.leavesTaken;
    if (days > remaining) {
      return res.status(400).json({ success: false, error: 'Leave exceeds available balance' });
    }

    const leave = new Leave({ employeeId, startDate: start, endDate: end });
    await leave.save();

    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all leave requests of an employee
router.get('/status/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

    const leaves = await Leave.find({ employeeId: req.params.employeeId }).sort({ startDate: -1 });
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Approve leave
router.post('/approve/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Leave already processed' });
    }

    const employee = await Employee.findById(leave.employeeId);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

    const days = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
    const remaining = employee.totalLeaves - employee.leavesTaken;

    if (days > remaining) {
      return res.status(400).json({ success: false, error: 'Leave exceeds available balance' });
    }

    leave.status = 'Approved';
    await leave.save();

    employee.leavesTaken += days;
    await employee.save();

    res.json({ success: true, message: 'Leave approved', data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reject leave
router.post('/reject/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });
    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Leave already processed' });
    }

    leave.status = 'Rejected';
    await leave.save();

    res.json({ success: true, message: 'Leave rejected', data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Summary of all employees
router.get('/summary', async (req, res) => {
  try {
    const employees = await Employee.find();
    const summary = await Promise.all(
      employees.map(async (emp) => {
        const leaves = await Leave.find({ employeeId: emp._id });
        return {
          employeeId: emp._id,
          name: emp.name,
          department: emp.department,
          totalLeaves: emp.totalLeaves,
          leavesTaken: emp.leavesTaken,
          remaining: emp.totalLeaves - emp.leavesTaken,
          applied: leaves.length,
          approved: leaves.filter(l => l.status === 'Approved').length,
          rejected: leaves.filter(l => l.status === 'Rejected').length,
          pending: leaves.filter(l => l.status === 'Pending').length,
        };
      })
    );

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
