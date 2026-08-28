import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <div className="brand">
        <span>🎓</span>
        <span>Plateforme QCM</span>
      </div>
      <div className="nav-links">
        <button onClick={handleLogout} className="btn btn-danger">
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}