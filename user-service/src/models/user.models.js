import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    
    picture: {
        type: String,
        default: ""
    },

    refreshToken: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
})

export default mongoose.model("User", userSchema);