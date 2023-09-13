import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CandidateSchema = new Schema(
    {   
        _id: {type: String},
        name: { type: String, required: true },
        voted: { type: Boolean, default: false },
        isHost: { type: Boolean, default: false },
        count: {type: Number, default: 0},
    }
);

const Candidate = model("Candidate", CandidateSchema);

export default Candidate;