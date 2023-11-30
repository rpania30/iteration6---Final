const express = require('express');
const User = require('../models/User');
const router = express();
const bcrypt = require('bcrypt');
const axios = require('axios');
const { sampleSize } = require('lodash'); 
const mongoose = require('mongoose');

router.set('view engine', 'ejs');



// MongoDB connection URL and Database Name
const url = 'mongodb://localhost:27017/Users';

// Connect to MongoDB with Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB at ${url}`))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define a schema for tracks
const trackSchema = new mongoose.Schema({
  name: String,
  artist: String,
  genre: String,
  year: Number
});

// Create a model from the schema
const Track = mongoose.model('Track', trackSchema);


const SongListSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    year: Number,
    featuredArtist: String
});

const SongList = mongoose.model('SongList', SongListSchema, 'songlist');


router.get('/login', (req, res) => {
    res.render('pages/Newpages/login', { pageTitle: 'Login' });
});

// router.post('/login', (req, res) => {
//     res.redirect('/');
// });

// Define routes
router.post('/', (req, res) => {
    res.render('pages/Newpages/index', { page: 'Home', pageTitle: 'Producer Dashboard' });
});
router.get('/', (req, res) => {
    res.render('pages/Newpages/index', { page: 'Home', pageTitle: 'Producer Dashboard' });
});

router.get('/playlist-builder', async (req, res) => {
    try {
        const songs = await Track.find({});
        const songlist = await SongList.find({});
        res.render('pages/Newpages/playlist-builder', { page: 'Playlist Builder', songs: songs, songlist: songlist, pageTitle: 'Playlist Builder' });
    } catch (err) {
        res.status(500).send('Error fetching songs');
    }
});


router.get('/event-promotions', (req, res) => {
    res.render('pages/Newpages/event-promotions', { page: 'Event Promotions', pageTitle: 'Event Promotions' });
});

// Endpoint to add a song
router.post('/addSong', async (req, res) => {
    const newSong = new Track(req.body);
    try {
        await newSong.save();
        res.redirect('pages/Newpages/playlist-builder');
    } catch (err) {
        res.status(500).send('Error adding song');
    }
});

// Endpoint to delete a song
router.post('/deleteSong', async (req, res) => {
    try {
        await Track.findByIdAndDelete(req.body.id);
        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting song' });
    }
});

router.post('/clearPlaylist', async (req, res) => {
    try {
        // This will delete all documents in the 'Track' collection
        const result = await Track.deleteMany({});
        res.json({ message: 'Playlist cleared', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing playlist', error: err.message });
    }
});

module.exports = router;
