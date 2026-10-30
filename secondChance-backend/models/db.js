// db.js - MongoDB Connection Helper
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL with database name from environment variables
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'secondChance';

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);

    // Connect to MongoDB using the required client.connect() method
    await client.connect();
    console.log('Connected successfully to MongoDB database:', dbName);

    // Retrieve database instance
    dbInstance = client.db(dbName);

    // Return database instance
    return dbInstance;
}

module.exports = connectToDatabase;
