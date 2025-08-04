const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');

// App Setup
const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON requests

// Routes
app.use('/api/auth', authRoutes);  // Use authentication routes for signup and login

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('MongoDB Connection Error:', err);
    });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
