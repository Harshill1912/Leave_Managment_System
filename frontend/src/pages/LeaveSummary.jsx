import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function LeaveSummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/leave/summary');
        setSummary(res.data.data);
      } catch (err) {
        console.error('Error fetching summary', err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Leave Summary</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Employee</th>

            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Taken</th>
            <th className="px-4 py-2 border">Remaining</th>
            <th className="px-4 py-2 border">Approved</th>
            <th className="px-4 py-2 border">Rejected</th>
            <th className="px-4 py-2 border">Pending</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(emp => (
            <tr key={emp.employeeId} className="text-center">
              <td className="border px-4 py-2">{emp.name}</td>
             
              <td className="border px-4 py-2">{emp.totalLeaves}</td>
              <td className="border px-4 py-2">{emp.leavesTaken}</td>
              <td className="border px-4 py-2">{emp.remaining}</td>
              <td className="border px-4 py-2 text-green-600">{emp.approved}</td>
              <td className="border px-4 py-2 text-red-600">{emp.rejected}</td>
              <td className="border px-4 py-2 text-yellow-600">{emp.pending}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
