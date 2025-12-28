import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isAuthenticated, logout } from '../services/authService';
import { showSuccessToast } from '../utils/toastService';
import { Navbar, Container, Button } from 'react-bootstrap';

function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    showSuccessToast('toast.auth.logoutSuccess');
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom mb-0">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t('common.appName')}
        </Navbar.Brand>
        
        {authenticated && (
            <Button 
                variant="primary" 
                onClick={handleLogout}
            >
              {t('common.logout')}
            </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;  