const mongoose = require("mongoose");
const { Schema } = mongoose;
const Singer = new Schema({
	name: String,
	age: Number
}, {versionKey: false});

module.exports = mongoose.model("Singers", Singer)
