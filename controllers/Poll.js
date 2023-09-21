import Participant from "../model/participant.js";
import mongoose from "mongoose";
import Poll from "../model/poll.js";
import Candidate from "../model/candidate.js";

const createAndSavePoll = async (pollID, pollName) => {
    try {
        // Create a new poll document
        const poll = new Poll({
            _id: pollID,
            host: "Avccs",
            name: pollName, // Assuming 'name' is a field in your Poll model
            ended: false,
        });

        // Save the poll to the database
        await poll.save();

        // After saving the poll, copy participants to it
        await copyParticipantsToPoll(pollID);

        console.log(`Poll created with ID: ${poll._id}`);
    } catch (error) {
        console.error('Error creating poll:', error);
    }
};


const createUserFromUserArray = async (userArray) => {
    try {
        for (const user of userArray) {
            // Create participant data
            const participant = new Participant({
                _id: user.id,
                name: user.name,
                voted: false,
                isHost: false, // Assuming participants are not hosts
            });

            // Save participant to the participant database
            await participant.save();

            console.log(`User ${user.name} has been created.`);
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
};


const login = async (staffID, callback) => {
    try {
        // Find the participant in the database based on staffID
        const participant = await Participant.findOne({ _id: staffID });

        if (!participant) {
            console.log(`User ${staffID} was not found in the participant database.`);
            callback(null); // Indicate that the user does not exist via the callback
            return;
        }

        console.log(`User ${staffID} exists in the participant database.`);

        // If the user exists, you can return their data via the provided callback
        callback(participant);
    } catch (error) {
        console.error('Error checking participant:', error);
        callback(null); // Handle the error and indicate that the user does not exist via the callback
    }
};




const fetchAllPolls = async () => {
    try {
        // Use the find method to fetch all polls from the database
        const allPolls = await Poll.find({});

        return allPolls;
    } catch (error) {
        console.error('Error fetching polls:', error);
        throw error; // You can choose to handle the error differently if needed
    }
};


const removeParticipantFromDB = async (pollID, userName) => {
    try {
        // Assuming you have a Mongoose model for your poll
        // Use Mongoose to remove the participant
        await Poll.updateOne(
            { _id: pollID },
            { $pull: { participants: { name: userName } } }
        );
        console.log(`Removed ${userName} from the poll (${pollID})`);
    } catch (error) {
        console.error('Error removing participant from the database:', error);
    }
};

const addCandidateToPoll = async (pollID, candidateData) => {
    try {
        // Find the poll document by its ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error(`Poll with ID ${pollID} not found.`);
            return;
        }

        // Create a new participant using the Participant model
        const participant = new Candidate(candidateData);

        // Add the participant to the poll's participants array
        poll.participants.push(participant);

        // Save the updated poll document
        await poll.save();

        console.log(`Participant ${participantData.name} added to poll ${pollID}`);
    } catch (error) {
        console.error('Error adding participant to poll:', error);
    }
};

const copyParticipantsToPoll = async (pollID) => {
    try {
        // Find the poll document by its ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error(`Poll with ID ${pollID} not found.`);
            return;
        }

        // Fetch all participants from the Participant collection
        const allParticipants = await Participant.find({});

        // Add each participant to the poll's participants array
        allParticipants.forEach((participant) => {
            poll.participants.push(participant);
        });

        // Save the updated poll document
        await poll.save();

        console.log(`All participants copied to poll ${pollID}`);
    } catch (error) {
        console.error('Error copying participants to poll:', error);
    }
};


const addParticipantToCandidates = async (pollID, staffID) => {
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
            // Create a candidate object based on the participant's information
            const candidate = {
                _id: participant._id,
                name: participant.name,
                isHost: participant.isHost, // Assuming candidates are not hosts
                voted: false, // Initialize the voted property as false
                count: 0, // Initialize the count for the candidate
            };

            // Add the candidate to the candidates array in the poll
            poll.candidates.push(candidate);

            // Save the updated poll
            await poll.save();

            console.log('User added to candidates.');
        } else {
            console.error('User not found in the Participants database.');
        }
    } catch (error) {
        console.error('Error adding user to candidates:', error);
    }
};


const voteForCandidate = async (pollID, candidateID, participantID) => {
    try {
        // Find the poll by ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error('Poll not found.');
            return null;
        }

        // Find the candidate in the candidates array
        const candidateIndex = poll.candidates.findIndex(
            (candidate) => candidate && candidate._id && candidate._id.toString() === candidateID
        );

        if (candidateIndex === -1) {
            console.error(`Candidate with ID ${candidateID} not found in poll ${pollID}.`);
            return null;
        }

        // Update the 'voted' property of the participant to true
        await participantVoted(pollID, participantID);

        // Increment the candidate's vote count
        poll.candidates[candidateIndex].count++;

        // Save the updated poll with the new vote count
        await poll.save();

        // Return the candidate
        return poll.candidates[candidateIndex];
    } catch (error) {
        console.error('Error voting for candidate:', error);
        return null; // You can handle the error as needed
    }
};

const annonVoteForCandidate = async (pollID, candidateID) => {
    try {
        // Find the poll by ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error('Poll not found.');
            return;
        }

        // Find the candidate in the candidates array
        const candidate = poll.candidates.find(
            (candidate) => candidate && candidate._id && candidate._id.toString() === candidateID
        );

        if (!candidate) {
            console.error(`Candidate with ID ${candidateID} not found in poll ${pollID}.`);
            return;
        }

        // Return the candidate
        return candidate;
    } catch (error) {
        console.error('Error voting for candidate:', error);
        return null; // You can handle the error as needed
    }
};

const participantVoted = async (pollID, participantID) => {
    try {
        // Find the poll by ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error('Poll not found.');
            return;
        }

        // Find the participant in the participants array
        const participant = poll.participants.find(
            (participant) => participant && participant._id && participant._id.toString() === participantID
        );

        if (!participant) {
            console.error(`Participant with ID ${participantID} not found in poll ${pollID}.`);
            return;
        }

        // Update the participant's 'voted' property to true
        participant.voted = true;

        // Save the updated poll with the 'voted' property updated
        await poll.save();

        console.log(`Updated 'voted' status for participant with ID ${participantID} in poll ${pollID}`);
    } catch (error) {
        console.error('Error updating voted status:', error);
    }
};

const candidateVoted = async (pollID, participantID) => {
    try {
        // Find the poll by ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error('Poll not found.');
            return;
        }

        // Find the participant in the participants array
        const participant = poll.participants.find(
            (participant) => participant && participant._id && participant._id.toString() === participantID
        );

        if (!participant) {
            console.error(`Participant with ID ${participantID} not found in poll ${pollID}.`);
            return;
        }

        // Update the participant's 'voted' property to true
        participant.voted = true;

        // Save the updated poll with the 'voted' property updated
        await poll.save();

        console.log(`Updated 'voted' status for participant with ID ${participantID} in poll ${pollID}`);
    } catch (error) {
        console.error('Error updating voted status:', error);
    }
};


export { createAndSavePoll, login, createUserFromUserArray, addCandidateToPoll, removeParticipantFromDB, addParticipantToCandidates, voteForCandidate, annonVoteForCandidate }