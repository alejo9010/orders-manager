const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const expense = await Expense.create({
    user: req.user.id,
    amount: req.body.amount,
    note: req.body.note,
  });
  console.log(expense);
  res.status(201).json(expense);
});

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const expense = await Expense.find({ user: req.user.id });
  res.send(expense);
});

// @desc    DELETE expenses ID
// @route   DELETE /api/expenses
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const expense = await Expense.findById(req.params.expenseId);
  if (!expense) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (expense.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }
  await expense.remove();
  res.status(200).json(expense);
});
module.exports = { createExpense, getExpenses, deleteExpense };
