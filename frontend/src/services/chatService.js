import axios from 'axios';

const API_BASE_URL = '/api/v1';

export const fetchChatData = async () => {
  try {
    const [channelsResponse, messagesResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/channels`),
      axios.get(`${API_BASE_URL}/messages`)
    ]);
    
    return {
      channels: channelsResponse.data,
      messages: messagesResponse.data
    };
  } catch (error) {
    const message = error.response?.data?.message || 'Ошибка загрузки данных';
    throw new Error(message);
  }
}

export const addChannel = async (name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/channels`, { name });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Ошибка добавления канала';
    throw new Error(message);
  }
}

export const addMessage = async (channelId, body, username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, { body, channelId, username });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Ошибка отправки сообщения';
    throw new Error(message);
  }
}