import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, //the one who is subscribing 
        ref: "User",
        required: true,
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, //the one whom subscriber is subscribing to
        ref: "User",
        required: true,
    },
},
    {
        timestamps: true,
    })

subscriptionSchema.index(
    { subscriber: 1, channel: 1 },
    { unique: true }
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
