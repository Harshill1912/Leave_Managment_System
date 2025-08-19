import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function LeaveStatus() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEmployees();
  }, []);

  const fetchLeaves = async (employeeId) => {
    try {
      const res = await api.get(`/leave/status/${employeeId}`);
      setLeaves(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (e) => {
    const empId = e.target.value;
    setSelectedEmp(empId);
    if (empId) fetchLeaves(empId);
  };

  const handleApproveReject = async (leaveId, action) => {
    try {
      const res = await api.post(`/leave/${action}/${leaveId}`);
      setMessage(res.data.message);
      fetchLeaves(selectedEmp);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error processing leave');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Leave Status</h2>

      <div className="mb-6">
        <label className="font-medium text-gray-700 mr-2">Select Employee:</label>
        <select
          value={selectedEmp}
          onChange={handleSelect}
          className="p-2 border rounded w-80"
        >
          <option value="">--Select--</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.email}) - {emp._id}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p className="text-center text-green-600 font-medium mb-4">{message}</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Reason</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{leave.leaveType}</td>
                <td className="py-2 px-4 border-b">{leave.reason}</td>
                <td
                  className={`py-2 px-4 border-b font-medium ${
                    leave.status === 'Approved'
                      ? 'text-green-600'
                      : leave.status === 'Rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {leave.status}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  {leave.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApproveReject(leave._id, 'approve')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveReject(leave._id, 'reject')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
