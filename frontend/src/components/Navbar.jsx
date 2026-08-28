import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#e2e8f0', marginBottom: '20px' }}>
      <div><strong>Application QCM</strong></div>
      <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white' }}>
        Se déconnecter
      </button>
    </nav>
  );
}