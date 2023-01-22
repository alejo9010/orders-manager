const express = require('express');
const router = express.Router();

const {
  getServers,
  createServer,
  updateServer,
  getServer,
} = require('../controller/serverController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getServers).post(protect, createServer);
router.route('/:id').get(protect, getServer).put(protect, updateServer);

module.exports = router;
