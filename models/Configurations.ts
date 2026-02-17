import mongoose from "mongoose";

const ConfigurationSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // Config Key
        value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    {
        timestamps: false,
        collection: "configurations",
        _id: false,
    }
);

export default mongoose.models.Configuration ||
    mongoose.model("Configuration", ConfigurationSchema);
