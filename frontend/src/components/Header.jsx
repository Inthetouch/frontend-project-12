import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAuthenticated, logout, getUsername } from '../services/authService';

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          {t('common.appName')}
        </Link>

        {authenticated && (
          <div className="header__user">
            <span className="header__username">{username}</span>
            <button onClick={handleLogout} className="header__logout-btn">
              {t('common.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;  