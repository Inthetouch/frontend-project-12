import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatData, addMessage as apiAddMessage } from '../services/chatService';


export const initializeChat = createAsyncThunk('chat/initializeChat', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchChatData();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', 
  async ({channelId, body, username}, { rejectWithValue }) => {
  try {
    const message = await apiAddMessage(channelId, body, username);
    return { channelId, message }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  channels: [],
  messages: {},
  currentChannel: null,
  loading: false,
  error: null,
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
          state.currentChannelId = state.channels[0].id;
        }
      })
      .addCase(initializeChat.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { channelId, message } = action.payload;
        if (!state.messages[channelId]) {
          state.messages[channelId] = [];
        }
        state.messages[channelId].push(message);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setCurrentChannel, clearError } = chatSlice.actions;
export default chatSlice.reducer;