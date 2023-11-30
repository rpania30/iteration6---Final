require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Clear the User collection
    await User.deleteMany({});
    // Array of test users
    const testUsers = [
      { username: 'fuckrishi', email: 'testdf1@example.com', password: 'pasasdfsword123' },
      { username: 'fuckyoutoo', email: 'tesasdft2@example.com', password: 'pasafssword123' },
    ];
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword
      });
      await newUser.save();
    }
    console.log('Test users created successfully');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestUsers();
