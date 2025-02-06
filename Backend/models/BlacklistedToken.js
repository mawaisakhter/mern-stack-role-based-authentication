// models/BlacklistedToken.js
const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
