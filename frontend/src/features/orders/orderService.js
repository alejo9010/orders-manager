import axios from 'axios';
const API_URL = '/api/orders/';
//Get all orders
const getOrders = async (token) => {
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

//Create new order
const createOrder = async (serverData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, serverData, config);
  return response.data;
};

//close  order
const closeOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + orderId,
    { status: 'Closed' },
    config
  );
  return response.data;
};

//close  order
const deleteOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + orderId, config);
  return response.data;
};

//close  order
const getOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + orderId, config);
  return response.data;
};

const orderService = {
  createOrder,
  getOrders,
  closeOrder,
  deleteOrder,
  getOrder,
};

export default orderService;
