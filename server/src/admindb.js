const connectDB = require("./mongodb");
const mongoose = require("mongoose");


connectDB();

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const admincollection = new mongoose.model("AdminCollection",AdminSchema)


module.exports = admincollection
