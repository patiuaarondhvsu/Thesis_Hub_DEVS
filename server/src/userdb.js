const connectDB = require("./mongodb");
const mongoose = require("mongoose");

connectDB();

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    verified: Boolean,
})

const userCollection = new mongoose.model("UserCollection",UserSchema)

module.exports = userCollection;
