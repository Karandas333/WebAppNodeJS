require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

const userSchema = mongoose.Schema({
  image: String,
  email: String,
  name: String
});

module.exports = mongoose.model('user', userSchema);