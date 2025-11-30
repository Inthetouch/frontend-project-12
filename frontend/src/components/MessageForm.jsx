import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../store/chatSlice";

function MessageForm() {
  const [messageBody, setMessageBody] = useState("");
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.chat);

  const username = localStorage.getItem("username") || "Аноним";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      return;
    }

    try {
      await dispatch(
        sendMessage({
          channelId: currentChannelId,
          body: messageBody,
          username,
        })
      ).unwrap();
      setMessageBody("");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-form__input"
        placeholder="Введите сообщение..."
        value={messageBody}
        onChange={(e) => setMessageBody(e.target.value)}
      />
      <button type="submit" className="message-form__button">
        Отправить
      </button>
    </form>
  );
}

export default MessageForm;