// searchRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
require('dotenv').config();

// GET /api/secondchance/search - Search for items with category filter
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        let query = {};

        // Filter by item name (case-insensitive regex)
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name.trim(), $options: 'i' };
        }

        // Filter by category (Task 6 requirement)
        if (req.query.category && req.query.category.trim() !== '') {
            query.category = req.query.category.trim();
        }

        // Filter by condition
        if (req.query.condition && req.query.condition.trim() !== '') {
            query.condition = req.query.condition.trim();
        }

        // Filter by age_years (less than or equal to)
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years, 10) };
        }

        const items = await collection.find(query).toArray();
        res.json(items);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
