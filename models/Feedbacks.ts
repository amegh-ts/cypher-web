import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        user_id: { type: Number, required: true },
        username: { type: String },
        feedback: { type: String, required: true },
        ticket_id: { type: String, required: true },
        status: {
            type: String,
            enum: ["Pending", "Resolved"],
            default: "Pending",
        },
        type: {
            type: String,
            enum: ["feedback", "report"],
            required: true,
        },
        date: { type: String },
        time: { type: String },
    },
    {
        timestamps: false,
        collection: "feedbacks",
    }
);

export default mongoose.models.Feedback ||
    mongoose.model("Feedback", FeedbackSchema);
