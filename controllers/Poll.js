import Participant from "../model/participant.js";
import mongoose from "mongoose";
import Poll from "../model/poll.js";

const createAndSavePoll = async (pollID, hostName, userID) => {
    try {
        // Create a new poll document
        const poll = new Poll({
            _id: pollID,
            host: hostName,
            staffID: "EMP-50443",
        });

        // Save the poll to the database
        await poll.save();

        console.log(`Poll created with ID: ${poll._id}`);

        // Create participant data
        const participantData = {
            _id: userID,
            name: hostName,
            staffID: "EMP-50443",
            voted: false,
            isHost: true,
        };

        // Add the participant to the poll
        await addParticipantToPoll(poll._id, participantData);

    } catch (error) {
        console.error('Error creating poll:', error);
    }
};

const createUserFromUserArray = async (pollID, userArray) => {
    try {
        // Find the poll document by its ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error(`Poll with ID ${pollID} not found.`);
            return;
        }

        for (const user of userArray) {
            // Create participant data
            const participantData = {
                _id: user.id,
                name: user.name,
                voted: false,
                isHost: false, // Assuming participants are not hosts
            };

            // Add the participant to the poll
            await addParticipantToPoll(poll._id, participantData);

            console.log(`User ${user.name} joined poll with ID: ${pollID}`);
        }
    } catch (error) {
        console.error('Error joining poll:', error);
    }
};

const joinPoll = async (pollID, staffID) => {
    try {
        // Find the poll document by its ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error(`Poll with ID ${pollID} not found.`);
            return;
        }

        // Check if the user already exists in the poll
        const existingParticipant = poll.participants.find(
            (participant) => participant._id.toString() === staffID
        );

        if (!existingParticipant) {
            console.log(`User ${staffID} was not found in the poll with ID: ${pollID}`);
            return;
        }

        console.log(`User ${staffID} joined poll with ID: ${pollID}`);
    } catch (error) {
        console.error('Error joining poll:', error);
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

const addParticipantToPoll = async (pollID, participantData) => {
    try {
        // Find the poll document by its ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error(`Poll with ID ${pollID} not found.`);
            return;
        }

        // Create a new participant using the Participant model
        const participant = new Participant(participantData);

        // Add the participant to the poll's participants array
        poll.participants.push(participant);

        // Save the updated poll document
        await poll.save();

        console.log(`Participant ${participantData.name} added to poll ${pollID}`);
    } catch (error) {
        console.error('Error adding participant to poll:', error);
    }
};

const addParticipantToCandidates = async (pollID, userID) => {
    try {
        // Find the poll by ID
        const poll = await Poll.findById(pollID);

        if (!poll) {
            console.error('Poll not found.');
            return;
        }

        // Find the participant in the participants array
        const participant = poll.participants.find(
            (participant) => participant && participant._id && participant._id.toString() === userID
        );

        if (participant) {
            // Create a candidate object based on the participant's information
            const candidate = {
                _id: participant._id,
                name: participant.name,
                isHost: participant.isHost, // Assuming candidates are not hosts
                voted: true, // You can set candidate-specific properties here
                count: 1, // Initialize the count for the candidate
            };

            // Add the candidate to candidates
            poll.candidates.push(candidate);

            // Save the updated poll
            await poll.save();
            // Update the 'voted' property of the candidate to true
            await candidateVoted(pollID, participant._id);
            console.log('User added to candidates.');
        } else {
            console.error('Participant not found in the poll.');
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


export { createAndSavePoll, joinPoll, createUserFromUserArray, addParticipantToPoll, removeParticipantFromDB, addParticipantToCandidates, voteForCandidate, annonVoteForCandidate }