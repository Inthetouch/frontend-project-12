import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchChatData, addMessage as apiAddMessage,
  addChannel as apiAddChannel,
  deleteChannel as apiDeleteChannel,
  renameChannel as apiRenameChannel,
} from '../services/chatService';

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

export const createChannel = createAsyncThunk(
  'chat/createChannel',
  async ({ name }, { rejectWithValue }) => {
    try {
      const channel = await apiAddChannel(name);
      return channel;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'chat/deleteChannel',
  async ({ channelId }, { rejectWithValue }) => {
    try {
      await apiDeleteChannel(channelId);
      return channelId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ channelId, name }, { rejectWithValue }) => {
    try {
      const channel = await apiRenameChannel(channelId, name);
      return channel;
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
      const exists = state.messages[channelId].some((msg) => msg.id === message.id);
      if (!exists) {
        state.messages[channelId].push(message);
      }
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
    
    removeChannelMessages: (state, action) => {
      const channelId = action.payload;
      delete state.messages[channelId];
    },

    addChannelFromSocket: (state, action) => {
      const channel = action.payload;
      const exists = state.channels.some((ch) => ch.id === channel.id);
      if (!exists) {
        state.channels.push(channel);
      }
    },

    updateChannelFromSocket: (state, action) => {
      const updatedChannel = action.payload;
      const index = state.channels.findIndex((ch) => ch.id === updatedChannel.id);
      if (index !== -1) {
        state.channels[index] = updatedChannel;
      }
    },

    removeChannelFromSocket: (state, action) => {
      const { id } = action.payload;
      state.channels = state.channels.filter((ch) => ch.id !== id);
      delete state.messages[id];

      if (state.currentChannelId === id) {
        const generalChannel = state.channels.find(
          (ch) => ch.name?.toLowerCase() === 'general'
        );
        state.currentChannelId = generalChannel?.id || state.channels[0]?.id || null;
      }
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
      .addCase(sendMessage.fulfilled, (state) => {
        state.isSending = false;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      });

      builder
      .addCase(createChannel.pending, (state) => {
        state.isLoadingChannels = true;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.isLoadingChannels = false;
        const newChannel = action.payload;
        state.channels.push(newChannel);
        state.messages[newChannel.id] = [];
        state.currentChannelId = newChannel.id;
        state.error = null;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.isLoadingChannels = false;
        state.error = action.payload;
      });

      builder
      .addCase(deleteChannel.pending, (state) => {
        state.isLoadingChannels = true;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.isLoadingChannels = false;
        const channelId = action.payload;
        state.channels = state.channels.filter((ch) => ch.id !== channelId);
        delete state.messages[channelId];

        if (state.currentChannelId === channelId) {
          state.currentChannelId = state.defaultChannelId;
        }
        state.error = null;
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.isLoadingChannels = false;
        state.error = action.payload;
      });

      builder
      .addCase(renameChannel.pending, (state) => {
        state.isLoadingChannels = true;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.isLoadingChannels = false;
        const updatedChannel = action.payload;
        const index = state.channels.findIndex((ch) => ch.id === updatedChannel.id);
        if (index !== -1) {
          state.channels[index] = updatedChannel;
        }
        state.error = null;
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.isLoadingChannels = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentChannel, 
  clearError, 
  addMessageFromSocket, 
  setSocketConnected, 
  setIsSending, 
  setError, 
  removeChannelMessages,
  addChannelFromSocket,
  updateChannelFromSocket,
  removeChannelFromSocket,
} = chatSlice.actions;
export default chatSlice.reducer;