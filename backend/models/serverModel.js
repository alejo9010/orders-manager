const mongoose = require('mongoose');

const serverSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    gameName: {
      type: String,
      required: [true, 'Please enter game name'],
    },
    serverName: {
      type: String,
      required: [true, 'Please enter server name'],
    },
    stock: {
      type: Number,
      default: 0,
    },
    isHidden: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Server', serverSchema);
