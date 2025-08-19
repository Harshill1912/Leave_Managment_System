import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddEmployee from './pages/AddEmployee';
import ApplyLeave from './pages/ApplyLeave';
import LeaveStatus from './pages/LeaveStatus';
import LeaveSummary from './pages/LeaveSummary'; 

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/">Add Employee</Link>
        <Link to="/apply-leave">Apply Leave</Link>
        <Link to="/leave-status">Leave Status</Link>
        <Link to="/leave-summary">Leave Summary</Link>
      </nav>

      <Routes>
        <Route path="/" element={<AddEmployee />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/leave-status" element={<LeaveStatus />} />
        <Route path="/leave-summary" element={<LeaveSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
