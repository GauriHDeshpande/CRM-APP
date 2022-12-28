const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    userType: {
        type: String,
        required: true,
        default: "CUSTOMER"
    },
    userStatus: {
        type: String,
        required: true,
        default: "APPROVED"
    },
    ticketsCreated: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    }
});

module.exports = mongoose.model("User", userSchema);