const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Add new employee
router.post('/', async (req, res) => {
  try {
    let { name, email, joiningDate } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!joiningDate) missingFields.push('joiningDate');
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields', missingFields });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, error: 'Employee with this email already exists' });
    }

    const employee = new Employee({ name, email, joiningDate });
    await employee.save();

    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get leave balance
router.get('/:id/balance', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });

    const remainingLeaves = employee.totalLeaves - employee.leavesTaken;
    res.json({ success: true, data: { employeeId: employee._id, remainingLeaves } });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid Employee ID' });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
