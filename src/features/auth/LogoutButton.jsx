import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from './authSlice';

export default function LogoutButton({ className = '' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <button type="button" className={`link-button ${className}`} onClick={handleLogout}>
      Sign out
    </button>
  );
}
