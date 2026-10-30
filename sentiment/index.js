// sentiment/index.js - Sentiment Analysis Microservice
require('dotenv').config();
const express = require('express');
const natural = require('natural'); // Task 8: Import the natural npm package

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sentiment analyzer route
app.post('/sentiment', async (req, res) => {
    const { sentence } = req.query;

    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with Natural's PorterStemmer and English language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer('English', stemmer, 'afinn');

    try {
        const words = sentence.split(' ');
        const analysisResult = analyzer.getSentiment(words);

        let sentiment = 'neutral';
        if (analysisResult < 0) {
            sentiment = 'negative';
        } else if (analysisResult > 0.33) {
            sentiment = 'positive';
        }

        res.status(200).json({
            sentence,
            sentimentScore: analysisResult,
            sentiment: sentiment
        });
    } catch (error) {
        res.status(500).json({ message: 'Error performing sentiment analysis', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Sentiment service running on port ${port}`);
});

module.exports = app;
