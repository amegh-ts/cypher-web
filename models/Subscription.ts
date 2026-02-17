import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        endpoint: { type: String, required: true },
        keys: {
            p256dh: { type: String, required: true },
            auth: { type: String, required: true },
        },
        created_at: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        collection: "subscriptions",
    }
);

export default mongoose.models.Subscription ||
    mongoose.model("Subscription", SubscriptionSchema);
