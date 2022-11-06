const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {type: String, unique: true}
  });
module.exports = mongoose.model('Movie', movieSchema);