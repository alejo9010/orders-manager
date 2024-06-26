import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from './orderService';
import { toast } from 'react-toastify';

const initialState = {
  orders: [],
  order: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isSuccessDelete: false,
  isOrderLoading: false,
  isOrderError: false,
  isOrderSuccess: false,
  message: '',
};

//Create new order
export const createOrder = createAsyncThunk('order/create', async (orderData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await orderService.createOrder(orderData, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

//Get orders
export const getOrders = createAsyncThunk('orders/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await orderService.getOrders(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

//Get order
export const getOrder = createAsyncThunk('orders/getOrder', async (orderId, thunkAPI) => {
  try {
    console.log(orderId);
    const token = thunkAPI.getState().auth.user.token;
    return await orderService.getOrder(orderId, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});
//Close order
export const closeOrder = createAsyncThunk('order/close', async (orderId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await orderService.closeOrder(orderId, token);
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
//Delete order
export const deleteOrder = createAsyncThunk('order/delete', async (orderId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await orderService.deleteOrder(orderId, token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    OrderReset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.isSuccessDelete = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.servers = null;
        notAuthorizedHandler(action.payload);
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.order = {};
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(closeOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(closeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.map((order) =>
          order._id === action.payload._id ? (order.status = 'Closed') : order
        );
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isSuccessDelete = false;
        const indexOfOrder = state.orders.findIndex((order) => order._id === action.payload._id);
        state.orders.splice(indexOfOrder, 1);
      });
  },
});

export const { OrderReset } = orderSlice.actions;
export default orderSlice.reducer;
