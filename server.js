import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createAndSavePoll, login, addParticipantToCandidates, voteForCandidate, annonVoteForCandidate, createUserFromUserArray } from "./controllers/Poll.js";
import Poll from "./model/poll.js";
import Candidate from "./model/candidate.js";
import Participant from "./model/participant.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://vott.com.ng", // Set the origin to your React app's domain
        methods: ["GET", "POST"]
    }
});

dotenv.config();

const uri = process.env.DB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.error("DB connection error:", err));

app.use(cors()); // Enable CORS middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Your routes here
app.get("/", (req, res) => {
    res.send("Welcome to Vott API");
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // UpdateUI event
    const emitUpdateUI = (pollID) => {
        io.to(pollID).emit('updateUI'); // Emit the 'updateUI' event to the specific poll room
    };

    socket.on("host", async (data, callback) => {
        const { pollID, pollName } = data;

        // Join the poll room
        socket.join(pollID);

        try {
            await createAndSavePoll(pollID, pollName);

            // Emit an 'updateUI' event to the joined poll room
            emitUpdateUI(pollID);
        } catch (error) {
            console.error('Error creating and saving poll:', error);
            callback({ success: false, error: 'Failed to create and save the poll.' });
        }
    });

    socket.on("login", async (data, callback) => {
        const { staffID } = data;

        try {
            // Call the login function to check if the user exists in the participant database
            login(staffID, (userData) => {
                // userData contains the participant data if the user exists

                if (userData) {
                    // User exists in the participant database, you can perform actions here
                    console.log(`User ${staffID} exists in the participant database:`, userData);

                    // You can return the user data to the client via the provided callback
                    callback(userData);
                } else {
                    // User not found in the participant database
                    console.log(`User ${staffID} not found in the participant database.`);
                    callback(null); // You can indicate that the user does not exist
                }
            });
        } catch (error) {
            console.error('Error checking user existence:', error);
            callback(null); // Handle the error and return null
        }
    });

    socket.on('createUsers', async (userArray) => {
        try {
            console.log("create");
            // Call the createUserFromUserArray function to create users
            await createUserFromUserArray(userArray);

            // Emit a success event if needed
            socket.emit('createUsersSuccess', 'Users created successfully');
        } catch (error) {
            // Emit an error event in case of any errors
            socket.emit('createUsersError', 'Error creating users');
        }
    });

    // Socket.io event listener for fetching polls and candidates
    socket.on('fetchPollsAndCandidates', async () => {
        try {
            // Fetch all polls from the database
            const allPolls = await Poll.find({});

            // Emit the "pollsFetched" event with the list of polls to the client
            socket.emit('pollsFetched', allPolls);

            // Fetch candidates for each poll and emit the "candidatesFetched" event
            for (const poll of allPolls) {
                const candidates = await Candidate.find({ poll: poll._id });
                // Emit the "candidatesFetched" event for each poll with the list of candidates
                socket.emit(`candidatesFetched-${poll._id}`, candidates);
            }
        } catch (error) {
            console.error('Error fetching polls and candidates:', error);
        }
    });


    socket.on('addCandidate', async ({ pollID, staffID }) => {
        try {
            // Find the poll by ID
            const poll = await Poll.findById(pollID);

            if (!poll) {
                console.error('Poll not found.');
                return;
            }

            // Check if the user exists in the Participants database
            const participant = await Participant.findOne({ _id: staffID });

            if (participant) {
                console.log(participant);
                // Check if the user is already a candidate in this poll
                const existingCandidate = poll.candidates.find((candidate) =>
                    candidate._id.toString() === staffID
                );

                if (!existingCandidate) {
                    // Create a candidate object based on the participant's information
                    const newCandidate = new Candidate({
                        _id: participant._id,
                        name: participant.name,
                        voted: true, // Initialize the voted property as false
                        isHost: false,
                        count: 1, // Initialize the count for the candidate
                    });

                    // Add the new candidate to the candidates array in the poll
                    poll.candidates.push(newCandidate);

                    console.log(`User with ID ${staffID} is now a candidate.`);
                } else {
                    console.error(`User with ID ${staffID} is already a candidate in this poll.`);
                }
            } else {
                console.error(`User with ID ${staffID} not found in the Participants database.`);
            }

            // Save the updated poll
            await poll.save();

            // Emit an 'updateUI' event to notify clients about the change
            emitUpdateUI(pollID);

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

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log("Server is running on port", PORT));
