import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serverService from './serverService';
import { toast } from 'react-toastify';

const initialState = {
  servers: [],
  server: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  stockIsLoading: false,
  stockIsSuccess: false,
  message: '',
};

//Get all Servers
export const getServers = createAsyncThunk('servers/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await serverService.getServers(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});
//get server
export const getServer = createAsyncThunk('servers/get-server', async (serverId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;

    return await serverService.getServer(serverId, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});
//Create new server
export const createServer = createAsyncThunk('server/create', async (serverData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await serverService.createServer(serverData, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});
//Not authorized handler
const notAuthorizedHandler = (msg) => {
  if (msg === 'Not authorized') {
    localStorage.removeItem('user');
  }
};
//Hide Server
export const hideServer = createAsyncThunk('server/hide', async (serverData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await serverService.hideServer(serverData, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const setStock = createAsyncThunk('server/set-stock', async (serverData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await serverService.setStock(serverData.id, serverData.stock, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
      state.stockIsLoading = false;
      state.stockIsSuccess = false;
    },
    resetServer: (state) => {
      state.server = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //Removing hidden servers
        state.servers = action.payload;
      })
      .addCase(getServers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.servers = null;
        notAuthorizedHandler(action.payload);
      })
      .addCase(getServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //Removing hidden servers
        state.server = action.payload;
      })
      .addCase(getServer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.server = {};
      })
      .addCase(createServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.servers.unshift(action.payload);
      })
      .addCase(createServer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(hideServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers.map((server) =>
          server._id === action.payload._id ? (server.isHidden = true) : server
        );
      })
      .addCase(hideServer.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(setStock.pending, (state, action) => {
        state.stockIsLoading = true;
      })
      .addCase(setStock.fulfilled, (state, action) => {
        state.stockIsLoading = false;
        state.stockIsSuccess = true;
        state.servers.map((server) =>
          server._id === action.payload._id ? (server.stock = action.payload.stock) : server
        );
      });
  },
});

export const { reset, resetServer } = serverSlice.actions;
export default serverSlice.reducer;
