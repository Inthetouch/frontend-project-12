import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  initializeChat, 
  addMessageFromSocket, 
  setSocketConnected, 
  setError,
  addChannelFromSocket,
  updateChannelFromSocket,
  removeChannelFromSocket,
} from '../store/chatSlice';
import { logout } from '../services/authService';
import { 
  initializeSocket, 
  disconnectSocket, 
  onNewMessage, 
  offNewMessage, 
  onError, 
  offError,
  onNewChannel,
  offNewChannel,
  onRenameChannel,
  offRenameChannel,
  onRemoveChannel,
  offRemoveChannel,
} from '../services/socketService';
import ChannelList from '../components/ChannelList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';
import AddChannelModal from '../components/AddChannelModal';
import RenameChannelModal from '../components/RenameChannelModal';
import DeleteChannelModal from '../components/DeleteChannelModal';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, socketConnected} = useSelector((state) => state.chat);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handlersRef = useRef({ 
    handleNewMessage: null, 
    handleError: null,
    handleNewChannel: null,
    handleRenameChannel: null,
    handleRemoveChannel: null,
  });

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
        
        const handleNewChannel = (channel) => {
          console.log('New channel received:', channel);
          dispatch(addChannelFromSocket(channel));
        };

        const handleRenameChannel = (channel) => {
          console.log('Channel renamed:', channel);
          dispatch(updateChannelFromSocket(channel));
        };

        const handleRemoveChannel = (data) => {
          console.log('Channel removed:', data);
          dispatch(removeChannelFromSocket(data));
        };

        handlers.handleNewMessage = handleNewMessage;
        handlers.handleError = handleError;
        handlers.handleNewChannel = handleNewChannel;
        handlers.handleRenameChannel = handleRenameChannel;
        handlers.handleRemoveChannel = handleRemoveChannel;

        onNewMessage(handleNewMessage);
        onError(handleError);
        onNewChannel(handleNewChannel);
        onRenameChannel(handleRenameChannel);
        onRemoveChannel(handleRemoveChannel);

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
      if (handlers.handleNewChannel) {
        offNewChannel(handlers.handleNewChannel);
      }
      if (handlers.handleRenameChannel) {
        offRenameChannel(handlers.handleRenameChannel);
      }
      if (handlers.handleRemoveChannel) {
        offRemoveChannel(handlers.handleRemoveChannel);
      }
      
      disconnectSocket();
      dispatch(setSocketConnected(false));
    }
  }, [dispatch, navigate]);

  const handleRenameClick = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
  };

  const handleDeleteClick = (channel) => {
    setSelectedChannel(channel);
    setShowDeleteModal(true);
  };

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
          <ChannelList
            onAddChannel={() => setShowAddModal(true)}
            onRenameChannel={handleRenameClick}
            onDeleteChannel={handleDeleteClick}
          />
          <main className="chat-main">
            <MessageList />
            <MessageForm />
          </main>
        </div>
      )}

      <AddChannelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <RenameChannelModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setSelectedChannel(null);
        }}
        channel={selectedChannel}
      />

      <DeleteChannelModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedChannel(null);
        }}
        channel={selectedChannel}
      />
    </div>
  );
};

export default MainPage;