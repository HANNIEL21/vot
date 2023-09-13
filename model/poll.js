import mongoose from "mongoose";

const { Schema, model } = mongoose;

const pollSchema = new Schema(
    {
        _id: { type: String, },
        host: { type: String, required: true },
        participants: [
            {
                _id: { type: String, },
                name: { type: String, required: true },
                voted: { type: Boolean, default: false },
                isHost: { type: Boolean, default: false },
            }
        ],
        candidates: [
            {   
                _id: {type: String},
                name: { type: String, required: true },
                voted: { type: Boolean, default: false },
                isHost: { type: Boolean, default: false },
                count: {type: Number, default: 0},
            }
        ],
    },
    { timestamps: true }
);

const Poll = model("Poll", pollSchema);

export default Poll;