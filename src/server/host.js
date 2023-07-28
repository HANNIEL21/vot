import { uid } from "uid";
import { db, } from "./firebase";
import { set, ref, push, remove, update } from "firebase/database";


// Host Poll
export const hostPoll = async (name) => {
    const hostId = uid();
    const pollId = uid();

    if (name !== "") {
        await set(ref(db, pollId + '/participants/' + hostId), {
            uid: hostId,
            name: name,
            host: true,
            voted: false,
            count: 0,
            candidate: false,
        }).then(() => {
            window.location.href = `/home/${pollId}/${hostId}`;
            alert(`${name} has lunched a poll`)
        })
    } else {
        alert("all fields are required");
        return;
    }
}

// Join Poll
export const joinPoll = async (pollID, name) => {
    const participantRef = ref(db, pollID + '/participants/');
    const newUser = push(participantRef);

    if (name !== "" && pollID !== "") {
        await set(newUser, {
            uid: newUser.key,
            name: name,
            host: false,
            count: 0,
            voted: false,
            candidate: false,
        }).then(() => {
            window.location.href = `/home/${pollID}/${newUser.key}`;
            alert(`${name} has joined the poll`);
        });
    } else {
        alert("all fields are required.")
        return;
    }
}

// Leave Poll
export const leavePoll = async (participant, pollID) => {
    remove(ref(db, pollID + '/participants/' + participant.uid));
}
//  End Poll
export const endPoll = async (pollID) => {
    remove(ref(db, pollID));
}

// Make Candidate
export const candidate = async (participant, pollID) => {
    if (participant.candidate === false) {
        update(ref(db, pollID + '/participants/' + participant.uid), {
            uid: participant.uid,
            name: participant.name,
            host: false,
            count: 0,
            voted: false,
            candidate: true,
        })
    } else {
        alert(`${participant.name} is already a candidate`)
        return;
    }
}

// Vote
export const vote = async (participant, pollID) => {
    if (participant.candidate === true) {
        update(ref(db, pollID + '/participants/' + participant.uid), {
            uid: participant.uid,
            name: participant.name,
            host: false,
            count: 1,
            voted: true,
            candidate: false,
        })
    } else {
        return;
    }
}

/*
todo: mordify vote function
todo: create candidate list
*/ 