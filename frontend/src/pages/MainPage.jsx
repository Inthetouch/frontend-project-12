import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initializeChat, addMessageFromSocket, setSocketConnected, setError } from '../store/chatSlice';
import { logout } from '../services/authService';
import { initializeSocket, getSocket, disconnectSocket, onNewMessage, offNewMessage, onError, offError } from '../services/socketService';
import ChannelList from '../components/ChannelList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, currentChannelId, socketConnected} = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(initializeChat());
  }, [dispatch]);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        await initializeSocket();
        dispatch(setSocketConnected(true));
        console.log('WebSocket connected');
      } catch (error) {
        console.error('WebSocket connection error:', error);
        dispatch(setError('Ошибка подключения к серверу'));
      }
    };

    setupSocket();

    return () => {
      disconnectSocket();
      dispatch(setSocketConnected(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!currentChannelId) return;

    try {
      const socket = getSocket();

      const handleNewMessage = (message) => {
        dispatch(addMessageFromSocket({ channelId: currentChannelId, message, }));
      };

      const handleError = (errorMessage) => {
        console.error('Socket error:', errorMessage);
        dispatch(setError(errorMessage));
      };

      onNewMessage(currentChannelId, handleNewMessage);
      onError(handleError);

      return () => {
        offNewMessage(currentChannelId, handleNewMessage);
        offError(handleError);
      };
    } catch (error) {
      console.error('Socket error:', error);
    }
  }, [dispatch, currentChannelId]);

  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate('/login');
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Чат</h1>
        <div className='header-status'>
          <span className={`socket-status ${socketConnected ? 'connected' : 'disconnected'}`}>
            {socketConnected ? '● Подключено' : '● Отключено'}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
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