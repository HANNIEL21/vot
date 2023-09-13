import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ParticipantSchema = new Schema(
    {
        _id: { type: String }, // Custom _id field
        name: { type: String, required: true },
        voted: { type: Boolean, default: false },
        isHost: { type: Boolean, default: false },
    },
);

const Participant = model("Participant", ParticipantSchema);

export default Participant;
