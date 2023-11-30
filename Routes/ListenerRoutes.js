const express = require('express');
const User = require('../models/User');
const router = express();
const bcrypt = require('bcrypt');
const axios = require('axios');
const { sampleSize } = require('lodash'); 

router.set('view engine', 'ejs');

// Profile page route
router.get('/profile', async (req, res) => {
    try {
        const songsapiUrl = 'http://localhost:4000/db/getSongs';
        const songresponse = await axios.get(songsapiUrl);
        if (songresponse.status !== 200) {
            throw new Error(`HTTP error! SONG Status: ${songresponse.status}`);
        }

        const DJsUrl = 'http://localhost:4000/db/getDJS';
        const DJresponse = await axios.get(DJsUrl);
        if (DJresponse.status !== 200) {
            throw new Error(`HTTP error! DJ Status: ${DJresponse.status}`);
        }

        var songs = songresponse.data;
        var djs = DJresponse.data;
        // Process the data received
        console.log('Data received:', typeof(songs[0]), songs[0].songs, djs[0].djs);

        // Use lodash's sampleSize to get a random sample of 5 songs
        const randomSongs = sampleSize(songs[0].songs, 5);

        res.render('pages/profile', {
            songs: randomSongs,
            djs: djs[0].djs
        });
    } catch (error) {
        res.status(500).render('error', { title: 'Error Page', errorMessage: 'An error occurred.' });
    }
});


// Login page route
router.get('/login/producer', (req, res) => {
    res.render('pages/Newpages/index', { page: 'Home', pageTitle: 'Producer Dashboard' });
});
router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login Page' });
});

// Signup page route
router.get('/signup', (req, res) => {
    res.render('pages/signup', { title: 'Sign Up Page' });
});


module.exports = router;
