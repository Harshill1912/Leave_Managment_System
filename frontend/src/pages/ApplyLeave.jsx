import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ApplyLeave() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('Casual');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
       setEmployees(res.data.data)
      } catch (err) {
        console.log('Error fetching employees', err);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return setMessage('Select an employee');
    try {
      const res = await api.post('/leave/apply', { employeeId, startDate, endDate, leaveType, reason });
      setMessage('Leave applied successfully!');
      setStartDate(''); setEndDate(''); setReason('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error applying leave');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Apply Leave</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Employee</label>
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="p-2 border rounded">
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Leave Type</label>
          <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="p-2 border rounded">
            <option value="Casual">Casual</option>
            <option value="Sick">Sick</option>
            <option value="Earned">Earned</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Date</label>
          <input type="date" className="p-2 border rounded" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Date</label>
          <input type="date" className="p-2 border rounded" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Reason</label>
          <textarea className="p-2 border rounded" value={reason} onChange={e => setReason(e.target.value)} />
        </div>

        <div className="md:col-span-2 flex justify-center mt-4">
          <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
            Apply Leave
          </button>
        </div>
      </form>

      {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
    </div>
  );
}
