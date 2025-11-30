import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initializeChat } from '../store/chatSlice';
import { logout } from '../services/authService';
import ChannelList from '../components/ChannelList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(initializeChat());
  }, [dispatch]);

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

      {error && (
        <div className='chat-error'>
          <p>Ошибка: {error}</p>
        </div>
      )}

      {loading ? (
        <div className='chat-loading'>
          <p>Загрузка...</p>
        </div>
      ) : (
        <div className="chat-container">
          <ChannelList />
          <main className="chat-main">
            <MessageList />
            <MessageForm />
          </main>
        </div>
      )}
    </div>
  );
};

export default MainPage;