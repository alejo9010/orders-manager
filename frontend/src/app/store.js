import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import serverReducer from '../features/servers/serverSlice';
import orderReducer from '../features/orders/orderSlice';
import expenseReducer from '../features/expenses/expenseSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    servers: serverReducer,
    orders: orderReducer,
    expenses: expenseReducer,
  },
});
