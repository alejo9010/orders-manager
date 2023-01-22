const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Server',
    },
    orderNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    profit: {
      type: Number,
      required: [true, 'Please add profit'],
    },
    gold: {
      type: Number,
      required: [true, 'Please add gold'],
    },
    characterName: {
      type: String,
      required: [true, 'Please enter character name'],
    },
    buyerName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
