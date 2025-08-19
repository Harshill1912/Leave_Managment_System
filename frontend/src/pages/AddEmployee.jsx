import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AddEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.data);
    } catch (err) {
      console.log('Error fetching employees', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/employees', { name, email, joiningDate });
      setMessage(`Employee added! name: ${res.data.data.name}`);
      setName('');
      setEmail('');
      setJoiningDate('');
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding employee');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Add New Employee</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Full Name"
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Email Address"
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Joining Date</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            value={joiningDate}
            onChange={e => setJoiningDate(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-3 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200 font-medium"
          >
            Add Employee
          </button>
        </div>
      </form>

      {message && <p className="mt-6 text-center text-green-600 font-medium">{message}</p>}

      {/* Dynamic Employee Table */}
      <div className="mt-10 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">ID</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Name</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Email</th>
              <th className="py-2 px-4 text-left text-gray-700 font-semibold border-b">Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">No employees found.</td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{emp._id}</td>
                  <td className="py-2 px-4 border-b">{emp.name}</td>
                  <td className="py-2 px-4 border-b">{emp.email}</td>
                  <td className="py-2 px-4 border-b">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
