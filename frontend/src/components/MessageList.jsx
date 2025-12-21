import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function MessageList() {
  const { messages, currentChannelId } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();

  const currentMessages = useMemo(
    () => messages[currentChannelId] || [],
    [messages, currentChannelId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      return new Date(timestamp).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="message-list">
      <div className="message-list__messages">
        {currentMessages.length === 0 ? (
          <p className="message-list__empty">{t('chat.messages.empty')}</p>
        ) : (
          currentMessages.map((message) => (
            <div key={message.id} className="message">
              <div className="message__header">
                <span className="message__username">{message.username}</span>
                {message.timestamp && (
                  <span className="message__time">{formatTime(message.timestamp)}</span>
                )}
              </div>
              <p className="message__body">{message.body}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageList;