const express = require('express');
const router = express.Router();
const { updateUserRole } = require('../controllers/roleController');

// Update user role
router.put('/users/:userId/role', updateUserRole);

module.exports = router;

// http://localhost:8000/api/users/678fd6c7706d26bbf3ea4fab/role