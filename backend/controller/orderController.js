const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Server = require('../models/serverModel');
const Order = require('../models/orderModel');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const orders = await Order.find({ user: req.user.id }).populate({ path: 'server' });
  res.status(200).json(orders);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const server = await Server.findById(req.body.server);
  console.log(server);
  console.log(req.body.server);
  const orderExist = await Order.findOne({ orderNumber: req.body.orderNumber });
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  if (server.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  //Server do not exist
  if (!server) {
    res.status(400);
    throw new Error('Server do not exist');
  }

  //Server dont have stock
  if (server.stock < req.body.gold) {
    res.status(400);
    throw new Error('Not enought Stock');
  }
  // Order already exist
  if (orderExist) {
    res.status(409);
    throw new Error('Order Already Exist');
  }
  const order = await Order.create({
    user: req.user.id,
    server: server._id,
    orderNumber: req.body.orderNumber,
    profit: req.body.profit,
    gold: req.body.gold,
    characterName: req.body.characterName,
    buyerName: req.body.buyerName,
  });
  res.status(201).json(order);
});

// @desc    Update order
// @route   PUT /api/orders/orderId
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }
  const updateOrder = await Order.findByIdAndUpdate(req.params.orderId, req.body);
  res.status(200).json(updateOrder);
});

// @desc    Get order
// @route   Get /api/orders/orderId
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const order = await Order.findById(req.params.orderId).populate({ path: 'server' });
  console.log(order);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  res.status(200).json(order);
});

// @desc    Delete order
// @route   Delete /api/orders/orderId
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  //Get user using the id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }
  await order.remove();
  res.status(200).json(order);
});
module.exports = { getOrders, createOrder, updateOrder, deleteOrder, getOrder };
