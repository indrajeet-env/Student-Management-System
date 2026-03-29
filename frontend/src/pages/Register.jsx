import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: '',
    rollNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container card" style={{ maxWidth: '500px' }}>
        <h2 className="text-center">Register Student</h2>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Branch</label>
            <input name="branch" type="text" value={formData.branch} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input name="year" type="number" value={formData.year} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Roll Number</label>
            <input name="rollNumber" type="text" value={formData.rollNumber} onChange={handleChange} required />
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center mt-20">
          Already have an account? <Link to="/login" className="link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
