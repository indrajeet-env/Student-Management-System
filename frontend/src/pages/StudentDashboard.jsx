import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get('/api/attendance/me'),
        api.get(`/api/attendance/monthly?month=${month}&year=${year}`)
      ]);
      setAttendance(listRes.data.data || []);
      setStats(statsRes.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Student Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h3>Filter Stats</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Month</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Year</label>
            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Days</h3>
            <p>{stats.totalDays || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Present Days</h3>
            <p>{stats.presentDays || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Attendance Percentage</h3>
            <p>{stats.percentage ? `${stats.percentage}%` : '0%'}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3>All Attendance Records</h3>
        {loading ? (
          <p>Loading...</p>
        ) : attendance.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
