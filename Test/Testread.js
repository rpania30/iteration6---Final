require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function readTestUsers() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({});
    console.log('Test users:', users);

  } catch (error) {
    console.error('Error reading test users:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Uncomment the function you want to run
readTestUsers();
