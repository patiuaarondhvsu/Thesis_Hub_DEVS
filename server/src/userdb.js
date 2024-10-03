const connectDB = require("./mongodb");
const mongoose = require("mongoose");

connectDB();

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    studentNo: String,
    verified: Boolean,
})

const userCollection = new mongoose.model("UserCollection",UserSchema)

module.exports = userCollection;
