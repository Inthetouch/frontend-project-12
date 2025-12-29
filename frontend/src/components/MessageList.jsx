import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

function MessageList() {
  const { messages, currentChannelId } = useSelector(state => state.chat)
  const messagesEndRef = useRef(null)

  const channelMessages = messages[currentChannelId] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages])

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 flex-grow-1">
      {channelMessages.length > 0
        ? (
            channelMessages.map(message => (
              <div key={message.id} className="text-break mb-2">
                <b>{message.username}</b>
                :
                {message.body}
              </div>
            ))
          )
        : (
            null
          )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
