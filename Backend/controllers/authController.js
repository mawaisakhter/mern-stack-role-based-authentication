const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

// Register User
const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    
    const normalizedUsername = username.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username: normalizedUsername, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Route to check username availability
const CheckUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const existingUser = await User.findOne({ username });
    res.json({ available: !existingUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const logoutUser = async (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ success: false, message: "No token provided." });
  }

  try {
    // Blacklist the token
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();

    res.status(200).json({ success: true, message: "Logged out successfully. Token is now invalid." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// Fetch All Users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserRole = req.user.role; // Assuming role is set in req.user
    
    let users;
    if (loggedInUserRole === 'SuperAdmin') {
      // Super Admin sees all users
      users = await User.find();
    } else if (loggedInUserRole === 'Admin') {
      // Admin sees only users with the role "user"
      users = await User.find({ role: 'User' });
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Fetch Single User by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User (without updating the role)
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, password } = req.body; // Don't include 'role' here

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) {
      user.password = await bcrypt.hash(password, 10);  // Hash the new password
    }
    
    // Only update the username and email if provided, don't allow role changes
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CheckUsername,
  register,
  login,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
