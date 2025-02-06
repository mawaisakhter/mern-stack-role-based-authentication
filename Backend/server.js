const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const postRoutes = require("./routes/postRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
dotenv.config();
connectDB();

// Routes
app.use("/api/users", authRoutes);
app.use("/api", roleRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on this post num ${PORT}`));


