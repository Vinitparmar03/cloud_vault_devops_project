import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        file: {
            public_id: String,

            url: String,

            secure_url: String,

            original_name: String,

            format: String,

            resource_type: String,

            bytes: Number,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Vault", vaultSchema);