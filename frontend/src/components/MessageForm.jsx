import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, setError } from '../store/chatSlice';

function MessageForm() {
  const [messageBody, setMessageBody] = useState('');
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const { currentChannelId, isSending, socketConnected } = useSelector(
    (state) => state.chat
  );
  
  const username = localStorage.getItem('username') || 'Anonymous';

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageBody.trim()) {
      setLocalError('Сообщение не может быть пустым');
      return;
    }

    if (!socketConnected) {
      setLocalError('Нет подключения к серверу. Попробуйте позже.');
      return;
    }

    try {
      setLocalError(null);

      await dispatch(
        sendMessage({
          channelId: currentChannelId,
          body: messageBody,
          username,
        })
      ).unwrap();

      setMessageBody('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      setLocalError(error.message || 'Ошибка отправки сообщения');
      dispatch(setError(error.message));
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      {localError && <div className="message-form__error">{localError}</div>}

      <input
        type="text"
        className="message-form__input"
        placeholder="Введите сообщение..."
        value={messageBody}
        onChange={(e) => setMessageBody(e.target.value)}
        disabled={isSending || !socketConnected}
      />

      <button
        type="submit"
        className="message-form__button"
        disabled={isSending || !socketConnected || !messageBody.trim()}
      >
        {isSending ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
}

export default MessageForm;