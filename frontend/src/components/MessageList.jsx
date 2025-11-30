import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function MessageList() {
  const { messages, currentChannelId } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  const currentMessages = messages[currentChannelId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);
  
  return (
    <div className="message-list">
      <div className="message-list__items">
        {currentMessages.length === 0 ? (
          <p className="message-list__empty">Нет сообщений. Начните беседу!</p>
        ) : (
          currentMessages.map((message) => (
            <div key={message.id} className="message">
              <span className="message__username">{message.username}:</span>
              <p className="message__body">{message.body}</p>
              {message.timestamp && (<span className="message__time">
                {new Date(message.timestamp).toLocaleTimeString('ru-RU')}
              </span>
              )}
          </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageList;