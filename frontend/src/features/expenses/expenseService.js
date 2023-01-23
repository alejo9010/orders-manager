import axios from 'axios';
const API_URL = '/api/expenses/';
const getExpenses = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

const createExpense = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const deleteExpense = async (expenseId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + expenseId, config);
  return response.data;
};
const expenseService = { getExpenses, createExpense, deleteExpense };

export default expenseService;
