const mongoose = require('mongoose');
const User = require('../models/User');

const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  console.log(userId);
  console.log(role);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const validRoles = ['User', 'Admin', 'SuperAdmin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err.message });
  }
};


module.exports = { updateUserRole };
