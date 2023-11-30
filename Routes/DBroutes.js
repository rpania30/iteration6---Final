require('dotenv').config();
const express = require('express');
const User = require('../models/User');
const Pref = require('../models/Preference');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



router.post('/addPreference', async (req, res) => {
    const newpref = new Pref({Name :  req.body.p});
    const itemdata = await addData(newpref, "Preference", "Users");
    res.json(itemdata);
});

router.get('/removePreference/:preferenceId', async (req, res) => {
    const preferenceId = req.params.preferenceId;
    console.log("TEST ", preferenceId);
    if (preferenceId < 0) {
        removeAll();
        res.json({ message: 'All preferences removed successfully' });
        return;
    }
    try {
        // Connect to the database and access the collection
        await mongoose.connect(`${process.env.DATABASE_URL}/Users`);

        const collection = mongoose.connection.collection('preferences');

        // Convert the preferenceId to ObjectId
        const objectId = new mongoose.Types.ObjectId(preferenceId);

        // Remove the preference based on the provided preferenceId
        const result = await collection.deleteOne({ _id: objectId });

        if (result.deletedCount === 1) {
            console.log('Preference removed successfully');
            res.json({ message: 'Preference removed successfully' });
        } else {
            console.log('Preference not found');
            res.status(404).json({ error: 'Preference not found' });
        }
    } catch (error) {
        console.error('Error removing preference:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        mongoose.connection.close();
    }
});




router.get('/getPreference', async (req, res) => {
    const readDT = await readData("Users","preferences");
    console.log("preferences -- ",readDT);
    res.json(readDT);
});

router.get('/getDJS', async (req, res) => {
    const readDT = await readData("Users","DJS");
    console.log("DJS -- ",readDT);
    res.json(readDT);
});

router.get('/getSongs', async (req, res) => {
    const readDT = await readData("Users", "Songs");
    console.log("ooooo  -", readDT, { readDT });
    res.json(readDT);
});



router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;  // Destructure properties from the request body

    try {
        // Create a new user using the User model
        const newUser = new User({
            username: username,
            email: email,
            password: password,
        });

        // Save the new user to the database using the addData function
        const addedUserData = await addData(newUser, 'Preference', 'Users');
        // Return the _id of the added item
        res.cookie({ RED_id: addedUserData._id });
        res.json({ userId: addedUserData._id  });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user with the provided username and password exists
        const userData = await readData('Preference', 'Users', {
            username: username,
            password: password,
        });

        if (userData.length === 1) {
            // User exists, return the user's id
            const userId = userData[0]._id;
            res.cookie('RED_id', userId);
            res.json({ userId: userId });
        } else {
            // User not found
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


async function addData(newData, loc, container) {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${container}`);

        // Save the data and capture the result, which includes the _id
        const result = await newData.save();

        console.log('Data saved successfully');
        
        // Return the _id of the added item
        return result;
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}


async function readData(container,collectionName) {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${container}`);
        // Access the specified collection
        const collection = mongoose.connection.collection(collectionName);

        const data = await collection.find({}).toArray();
        console.log(`Data from ${collectionName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error reading data from ${collectionName}:`, error);
    } finally {
        mongoose.connection.close();
    }
}

async function removeAll() {
  try {
    // Connect to the database and access the collection
    await mongoose.connect(`${process.env.DATABASE_URL}/Users`);

    const collection = mongoose.connection.collection('preferences');

    // Remove all items from the preference collection
    await collection.deleteMany({});

    console.log('Preferences removed successfully');
  } catch (error) {
    console.error('Error removing preferences:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}


module.exports = router;