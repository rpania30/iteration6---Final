const mongoose = require('mongoose');

const userPref = new mongoose.Schema({
  Name : {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model('Preference', userPref);
