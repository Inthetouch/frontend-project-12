import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUsername } from '../services/authService';

function Header() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const username = getUsername();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Hexlet Chat
        </Link>

        {authenticated && (
          <div className="header__user">
            <span className="header__username">{username}</span>
            <button onClick={handleLogout} className="header__logout-btn">
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;  