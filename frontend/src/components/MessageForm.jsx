import { useRef, useEffect, useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessage, setError } from '../store/chatSlice';
import { getUsername } from '../services/authService';
import { showErrorToast, showWarningToast } from '../utils/toastService';
import { cleanProfanity, isProfane } from '../utils/profanityFilter';

const MessageForm = () => {
  const { t } = useTranslation();
  const [messageBody, setMessageBody] = useState('');
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  
  const { currentChannelId, isSending, socketConnected } = useSelector(
    (state) => state.chat
  );

  const username = getUsername();

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChannelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageBody.trim()) {
      showWarningToast('chat.messages.validation.empty');
      return;
    }

    if (!socketConnected) {
      showErrorToast('toast.network.offline');
      return;
    }

    try {
      const cleanedMessage = cleanProfanity(messageBody);

      if (isProfane(messageBody)) {
        console.warn('Message contained profanity, cleaned:', cleanedMessage);
      }

      await dispatch(
        sendMessage({
          channelId: currentChannelId,
          body: cleanedMessage,
          username,
        })
      ).unwrap();

      setMessageBody('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      dispatch(setError(error.message));
      showErrorToast('toast.message.sendError');
    }
  };

  return (
    <Form 
      onSubmit={handleSubmit} 
      className="py-1 border rounded-2"
    >
      <InputGroup>
        <Form.Control
          ref={inputRef}
          aria-label={t('chat.messageForm.label')}
          placeholder={t('chat.messages.placeholder') || "Введите сообщение..."}
          className="border-0 p-0 ps-2" 
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          disabled={isSending}
          autoComplete="off"
        />
        
        <Button 
            variant="group-vertical" 
            type="submit" 
            disabled={isSending}
            className="border-0 btn-none text-dark"
            style={{ backgroundColor: 'transparent' }}
            title={t('common.send')}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 16 16" 
            width="20" 
            height="20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
          </svg>
          <span className="visually-hidden">{t('common.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;