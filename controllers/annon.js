import Poll from "../model/poll";

const joinAnnon = async (pollID) => {
    try {
        // Find poll by ID
        const poll = await Poll.findById(pollID);

        // Error handling
        if(!poll){
            console.error(`Poll with ID ${pollID} not found`);
            return;
        }

    } catch (error) {
        console.error("Error joining poll", error);
    }
}