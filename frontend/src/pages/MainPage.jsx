import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const MainPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Добро пожаловать в чат</h1>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </header>

      <main className="chat-content">
        <p>Здесь будет чат-приложение</p>
      </main>
    </div>
  );
};

export default MainPage;