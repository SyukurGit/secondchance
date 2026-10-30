// authRoutes.js - Authentication APIs (Register, Login, Update)
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secondchance_jwt_secret_key_2026';

// POST /api/auth/register - Register user
router.post('/register', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName || 'User',
            lastName: req.body.lastName || '',
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.status(201).json({ authtoken, email: req.body.email });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const theUser = await collection.findOne({ email: req.body.email });

        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Wrong password' });
        }

        const payload = {
            user: {
                id: theUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        return res.status(200).json({
            authtoken,
            userName: theUser.firstName,
            userEmail: theUser.email
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// PUT /api/auth/update - Update user information
router.put('/update', [
    body('name').notEmpty().withMessage('Name cannot be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.headers.email;
        if (!email) {
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();

        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        const payload = {
            user: {
                id: (updatedUser.value || updatedUser)._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
