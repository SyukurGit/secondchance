// secondChanceItemsRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Define upload directory for item images
const directoryPath = 'public/images';
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directoryPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// GET /api/secondchance/items - Get all items
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const secondChanceItems = await collection.find({}).toArray();
        res.json(secondChanceItems);
    } catch (e) {
        next(e);
    }
});

// POST /api/secondchance/items - Add a new item with file upload
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');

        const lastItemQuery = await collection.find().sort({ id: -1 }).limit(1);
        let secondChanceItem = req.body || {};

        await lastItemQuery.forEach(item => {
            secondChanceItem.id = (parseInt(item.id, 10) + 1).toString();
        });

        if (!secondChanceItem.id) {
            secondChanceItem.id = '1';
        }

        const date_added = Math.floor(new Date().getTime() / 1000);
        secondChanceItem.date_added = date_added;

        if (req.file) {
            secondChanceItem.image = `/images/${req.file.originalname}`;
        }

        const result = await collection.insertOne(secondChanceItem);
        res.status(201).json({ ...secondChanceItem, _id: result.insertedId });
    } catch (e) {
        next(e);
    }
});

// GET /api/secondchance/items/:id - Get a single item by ID
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const secondChanceItem = await collection.findOne({ id: id });

        if (!secondChanceItem) {
            return res.status(404).json({ error: 'secondChanceItem not found' });
        }
        res.json(secondChanceItem);
    } catch (e) {
        next(e);
    }
});

// PUT /api/secondchance/items/:id - Update an item by ID
router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const existingItem = await collection.findOne({ id });

        if (!existingItem) {
            return res.status(404).json({ error: 'secondChanceItem not found' });
        }

        const updatedData = {
            category: req.body.category || existingItem.category,
            condition: req.body.condition || existingItem.condition,
            age_days: req.body.age_days || existingItem.age_days,
            description: req.body.description || existingItem.description,
            updatedAt: new Date()
        };

        if (updatedData.age_days) {
            updatedData.age_years = Number((updatedData.age_days / 365).toFixed(1));
        }

        await collection.updateOne({ id }, { $set: updatedData });
        res.json({ uploaded: 'success' });
    } catch (e) {
        next(e);
    }
});

// DELETE /api/secondchance/items/:id - Delete an item by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const existingItem = await collection.findOne({ id });

        if (!existingItem) {
            return res.status(404).json({ error: 'secondChanceItem not found' });
        }

        await collection.deleteOne({ id });
        res.json({ deleted: 'success' });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
