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
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json(orders);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const server = await Server.findById(req.body.server);

  if (server.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const order = await Order.create({
    user: req.user.id,
    server: req.body.server,
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
  const updateOrder = await Order.findByIdAndUpdate(
    req.params.orderId,
    req.body
  );
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

  const order = await Order.findById(req.params.orderId);
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
