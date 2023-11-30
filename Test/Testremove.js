require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary

async function removeTestUsers() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove all users
    // await User.deleteMany({});

    // Or remove specific users, e.g., by username
    await User.deleteMany({ username: /^testuser/ }); // This will remove all users whose username starts with 'testuser'

    console.log('Test users removed successfully');
  } catch (error) {
    console.error('Error removing test users:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Uncomment the function you want to run
removeTestUsers();
