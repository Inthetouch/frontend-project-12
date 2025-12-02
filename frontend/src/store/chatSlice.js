import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatData, addMessage as apiAddMessage } from '../services/chatService';

export const initializeChat = createAsyncThunk(
  'chat/initializeChat',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchChatData();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ channelId, body, username }, { rejectWithValue }) => {
    try {
      const message = await apiAddMessage(channelId, body, username);
      return { channelId, message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  channels: [],
  messages: {},
  currentChannelId: null,
  loading: false,
  error: null,
  socketConnected: false,
  isSending: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    addMessageFromSocket: (state, action) => {
      const { channelId, message } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      state.messages[channelId].push(message);
    },

    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },

    setIsSending: (state, action) => {
      state.isSending = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeChat.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels || [];
        state.messages = {};

        if (action.payload.messages) {
          action.payload.messages.forEach((message) => {
            const channelId = message.channelId;
            if (!state.messages[channelId]) {
              state.messages[channelId] = [];
            }
            state.messages[channelId].push(message);
          });
        }

        if (state.channels.length > 0 && !state.currentChannelId) {
          const generalChannel = state.channels.find(
            (ch) => ch.name.toLowerCase() === 'general'
          );
          state.currentChannelId = generalChannel?.id || state.channels[0].id;
        }
      })
      .addCase(initializeChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        const { channelId, message } = action.payload;
        if (!state.messages[channelId]) {
          state.messages[channelId] = [];
        }
        state.messages[channelId].push(message);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentChannel, clearError, addMessageFromSocket, setSocketConnected, setIsSending, setError } = chatSlice.actions;
export default chatSlice.reducer;