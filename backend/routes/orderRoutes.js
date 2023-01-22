const express = require('express');
const router = express.Router();

const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controller/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getOrders).post(protect, createOrder);

router
  .route('/:orderId')
  .put(protect, updateOrder)
  .delete(protect, deleteOrder);
// router.route('/:id').get(protect, getOrder).put(protect, updateOrder);

module.exports = router;
