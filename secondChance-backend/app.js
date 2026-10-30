/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectToDatabase = require('./models/db');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3060;

// Connect to MongoDB
connectToDatabase()
    .then(() => console.log('Successfully connected to MongoDB server'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Route handlers
const secondChanceRoutes = require('./routes/secondChanceItemsRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use(express.static(path.join(__dirname, 'public')));

// Task 7: Routes declaration including /api/secondchance/search
app.use('/api/secondchance/items', secondChanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/secondchance/search', searchRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SecondChance API Backend Server' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(port, () => {
    console.log(`SecondChance server running on port ${port}`);
});

module.exports = app;
