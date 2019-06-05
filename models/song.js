const mongoose = require('mongoose');
const { Schema } = mongoose;

const Song = new Schema({
	name: String,
	genre: String,
	authorid: String
}, {versionKey: false});

module.exports = mongoose.model("Songs", Song);
