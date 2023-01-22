const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  loginUser,
  registerUser,
  getMe,
} = require('../controller/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
module.exports = router;
