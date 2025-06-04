const express = require('express');
const path = require('path');
require('dotenv').config();

// Import upload routes and cloudinary config
const uploadRoutes = require('./routes/upload');
const { cloudinary } = require('./config/cloudinary');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API routes must come before static file serving
app.use('/api/upload', uploadRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/concerts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'concerts.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

app.get('/portraits', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'portraits.html'));
});

app.get('/nightlife', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nightlife.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Display photos in portfolio
const fs = require('fs');

app.get('/api/photos', (req, res) => {
  fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read images' });

    const photos = files.map(filename => `/uploads/${filename}`);
    res.json(photos);
  });
});
