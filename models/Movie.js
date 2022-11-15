const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {type: String, unique: true, require: true},
    link: {type: String, unique: true, sparse: true}
  });
module.exports = mongoose.model('Movie', movieSchema);