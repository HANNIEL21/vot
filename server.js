import express from "express";
import bodyparser from "body-parser";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createAndSavePoll, joinPoll, addParticipantToCandidates, voteForCandidate, annonVoteForCandidate } from "./controllers/Poll.js";
import Poll from "./model/poll.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Fixed a typo here
        methods: ["GET", "POST"]
    }
});

dotenv.config();

const uri = process.env.DB_URI;

mongoose.connect(uri)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.error("DB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // UpdateUI event
    const emitUpdateUI = (pollID) => {
        io.to(pollID).emit('updateUI'); // Emit the 'updateUI' event to the specific poll room
    };

    socket.on("host", async (data, callback) => {
        const { hostName, pollID, userID } = data;

        // Join the poll room
        socket.join(pollID);

        try {
            await createAndSavePoll(pollID, hostName, userID);
            callback({ success: true, poll: pollID, user: userID });

            // Emit an 'updateUI' event to the joined poll room
            emitUpdateUI(pollID);
        } catch (error) {
            console.error('Error creating and saving poll:', error);
            callback({ success: false, error: 'Failed to create and save the poll.' });
        }
    });

    socket.on("join", (data) => {
        const { staffID, pollID, userID } = data;

        // Join poll
        socket.join(pollID);

        // Add user to the poll
        joinPoll(pollID, staffID, userID);

        // Emit 'updateUI' event to the joined poll room
        emitUpdateUI(pollID);
    });

    socket.on('makeCandidate', async ({ pollID, userID }) => {
        try {
            // Call the function to add the user to candidates
            await addParticipantToCandidates(pollID, userID);

            // Emit an 'updateUI' event to notify clients about the change
            emitUpdateUI(pollID);

            console.log(`User with ID ${userID} is now a candidate.`);
        } catch (error) {
            console.error('Error making user a candidate:', error);
        }
    });

    socket.on('vote', async ({ pollID, candidateID, participantID }) => {
        try {
            const candidate = await voteForCandidate(pollID, candidateID, participantID);

            if (candidate) {
                console.log(`Vote cast for candidate ${candidateID} by participant ${participantID}`);
                // Notify clients about the change
                emitUpdateUI(pollID);
            } else {
                console.error('Failed to cast the vote or candidate ID mismatch.');
            }
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    });


    socket.on('fetchData', async (pollID) => {
        try {
            const data = await Poll.find({ _id: pollID });
            socket.emit('dataFetched', data);
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    });

    // Annon
    socket.on('joinAnnon', (data) => {
        const { pollID } = data;

        // Join Poll
        socket.join(pollID);
    })

    socket.on('voteAnnon', async ({ pollID, candidateID }) => {
        try {
            // Call voteForCandidate to cast the vote
            const candidate = await annonVoteForCandidate(pollID, candidateID);

            if (!candidate) {
                // Handle the case where the vote couldn't be cast (e.g., candidate not found)
                console.error('Failed to cast the vote.');
                return;
            }

            // Check if the candidate's ID matches the provided candidateID
            if (candidate._id.toString() === candidateID) {
                // Update the candidate's vote count
                candidate.count++;

                // Save the updated candidate with the new vote count
                await candidate.save();
            } else {
                console.error('Candidate ID mismatch. Vote not cast.');
            }

            // Emit an 'updateUI' event to notify clients about the change
            emitUpdateUI(pollID);
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    })

    socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);

    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log("Server is running on port", PORT));