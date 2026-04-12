import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-white)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: 'var(--spacing-5)' }}>
        <h2 className="text-section-display" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-4)', textAlign: 'center' }}>Đăng nhập</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 500 }}>Tài khoản</label>
            <input 
              type="text" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div style={{ marginBottom: 'var(--spacing-2)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontWeight: 500 }}>Mật khẩu</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-dark" style={{ padding: 'var(--spacing-3)', fontSize: '1.1rem' }}>
            Vào hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
