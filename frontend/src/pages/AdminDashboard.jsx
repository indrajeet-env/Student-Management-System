import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentDetails(selectedStudent._id);
    }
  }, [selectedStudent, month, year]);

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await api.get('/api/admin/students');
      setStudents(res.data.data || res.data || []);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      setError('Failed to fetch students list');
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get(`/api/admin/attendance/${studentId}`),
        api.get(`/api/admin/attendance/${studentId}/monthly?month=${month}&year=${year}`)
      ]);
      setAttendance(listRes.data.data || listRes.data || []);
      setStats(statsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance data for student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Left Side: Student List */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <h3>All Students</h3>
          {studentsLoading ? (
            <p>Loading...</p>
          ) : students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No.</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} style={{ 
                      backgroundColor: selectedStudent?._id === student._id ? '#f1f1f1' : 'transparent' 
                    }}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>
                        <button onClick={() => setSelectedStudent(student)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        {selectedStudent && (
          <div className="card" style={{ flex: '2', minWidth: '300px' }}>
            <h3>Details for {selectedStudent.name}</h3>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Month</label>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Year</label>
                <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
              </div>
            </div>

            {loading ? (
              <p>Loading student data...</p>
            ) : (
              <>
                {stats && (
                  <div className="stats-grid" style={{ marginBottom: '20px' }}>
                    <div className="stat-card">
                      <h3>Total</h3>
                      <p>{stats.totalDays || 0}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Present</h3>
                      <p>{stats.presentDays || 0}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Percentage</h3>
                      <p>{stats.percentage ? `${stats.percentage}%` : '0%'}</p>
                    </div>
                  </div>
                )}

                <h4>Attendance Records</h4>
                {attendance.length === 0 ? (
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
