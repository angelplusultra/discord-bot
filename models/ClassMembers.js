const mongoose = require('mongoose')

const ClassMember = new mongoose.Schema({
    firstName: {type: String, unique: false, require: true},
    lastName: {type: String, unique: false, require: true},
    discordID: {type: Number, unique: true, require: true},
    checkInTime: Date || null,
    checkOutTime: Date || null,
    bananaCount: Number
  });
module.exports = mongoose.model('ClassMembers', ClassMember);