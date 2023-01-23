import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from './expenseService';
import { toast } from 'react-toastify';
const initialState = {
  expenses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.createExpense(data, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (expenseId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.deleteExpense(expenseId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getExpenses = createAsyncThunk(
  'expenses/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.getExpenses(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = action.payload;
      })
      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(
          (expense) => expense._id === action.payload._id
        );
        state.expenses.splice(index, 1);
      });
  },
});
export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;
