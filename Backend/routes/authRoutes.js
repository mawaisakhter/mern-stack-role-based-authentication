// const express = require("express");
// const { register, login } = require("../controllers/authController");
// const router = express.Router();
// router.post("/register", register);
// router.post("/login", login);
// module.exports = router;

const express = require('express');
const router = express.Router();
const { register, CheckUsername, login, logoutUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');
const authenticate = require("../middleware/authMiddleware");
const { authorizeRole } = require('../middleware/authorizeRole');

router.post('/register', register);
router.get("/check-username",CheckUsername);
router.post('/login', login);
router.post("/logout", authenticate, logoutUser);
router.get('/', authorizeRole(['Admin', 'SuperAdmin']), getAllUsers);
router.get('/:userId', authorizeRole(['Admin', 'SuperAdmin']), getUserById);
router.put('/:userId', authorizeRole(['Admin', 'SuperAdmin']), updateUser);
router.delete('/:userId', authorizeRole(['Admin', 'SuperAdmin']), deleteUser);

module.exports = router;

