const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  createExpense,
  getExpenses,
  deleteExpense,
} = require('../controller/expenseController');

router.route('/').get(protect, getExpenses).post(protect, createExpense);
router.route('/:expenseId').delete(protect, deleteExpense);
module.exports = router;
