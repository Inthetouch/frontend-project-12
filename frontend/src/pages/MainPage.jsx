import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initializeChat, addMessageFromSocket, setSocketConnected, setError } from '../store/chatSlice';
import { logout } from '../services/authService';
import { initializeSocket, disconnectSocket, onNewMessage, offNewMessage, onError, offError } from '../services/socketService';
import ChannelList from '../components/ChannelList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, socketConnected} = useSelector((state) => state.chat);

  const handlersRef = useRef({ handleNewMessage: null, handleError: null });

  useEffect(() => {
    dispatch(initializeChat());
  }, [dispatch]);

  useEffect(() => {
    const handlers = handlersRef.current;

    const setupSocket = async () => {
      try {
        await initializeSocket();
        dispatch(setSocketConnected(true));
        console.log('WebSocket connected');

        const handleNewMessage = (message) => {
          console.log('New message received:', message);
          dispatch(addMessageFromSocket({ channelId: message.channelId, message }));
        };

        const handleError = (errorMessage) => {
          console.error('Socket error:', errorMessage);
          dispatch(setError(errorMessage));
        };
        
        handlers.handleNewMessage = handleNewMessage;
        handlers.handleError = handleError;

        onNewMessage(handleNewMessage);
        onError(handleError);

      } catch (error) {
        console.error('WebSocket connection error:', error);
        if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
          logout();
          navigate('/login');
          return;
        }
        dispatch(setError('Ошибка подключения к серверу'));
      }
    };

    setupSocket();

    return () => {
      if (handlers.handleNewMessage) {
        offNewMessage(handlers.handleNewMessage);
      }

      if (handlers.handleError) {
        offError(handlers.handleError);
      }
      
      disconnectSocket();
      dispatch(setSocketConnected(false));
    }
  }, [dispatch, navigate]);

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