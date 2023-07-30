import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { db } from '../server/firebase';
import { BsFillHandIndexThumbFill } from 'react-icons/bs';
import { HiClipboardDocumentCheck } from 'react-icons/hi2';
import { MdSecurity } from 'react-icons/md';
import { BottomNav, ParticipantScreen, ChartScreen } from '../Export';
import { makeCandidate, vote } from '../server/host';

const Home = () => {
    const { pollID } = useParams();
    const [selected, setSelected] = useState("1");
    const [users, setUsers] = useState([]);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCandidatesAndUsers = async () => {
            await fetchCandidates();
            await fetchUsers();
        };

        const fetchCandidates = async () => {
            try {
                const q = query(ref(db, `${pollID}/participants/`), orderByChild("candidate"), equalTo(true));
                const snapshot = await new Promise((resolve) => onValue(q, resolve));
                const candidatesArray = snapshotToArray(snapshot);
                setCandidates(candidatesArray);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const userRef = ref(db, `${pollID}/participants/`);
                const snapshot = await new Promise((resolve) => onValue(userRef, resolve));
                const data = snapshot.val();
                if (data !== null) {
                    const userList = Object.values(data);
                    setUsers(userList);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchCandidatesAndUsers();
    }, [pollID]);

    const snapshotToArray = (snapshot) => {
        const candidatesArray = [];
        snapshot.forEach((childSnapshot) => {
            const candidate = childSnapshot.val();
            candidatesArray.push(candidate);
        });
        return candidatesArray;
    };

    const addCandidate = async (e, user) => {
        const { checked } = e.target;
        if (checked) {
            makeCandidate(user, pollID);
        } else {
            return;
        }
    };

    const handleLinkClick = (link) => {
        setSelected(link);
    };

    const copyText = () => {
        navigator.clipboard.writeText(pollID);
    };

    return (
        <div className="min-vh-100 bg-white">
            {/* Security Dropdown */}
            <div className="dropdown">
                <button className="btn btn-transparent security dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <MdSecurity className='fs-3 m-0 text-dark' />
                </button>
                <ul className="dropdown-menu p-2">
                    <div className="input-group">
                        <input type="text" className="form-control border-0" value={pollID} aria-describedby="button-addon2" readOnly />
                        <button className="btn btn-transparent border-0" type="button" id="button-addon2" onClick={copyText}>
                            <HiClipboardDocumentCheck className='m-0 text-dark' />
                        </button>
                    </div>
                </ul>
            </div>
            <main>
                {selected === "1" && <ChartScreen participants={users} />}
                {selected === "2" && <ParticipantScreen participantes={users} />}
            </main>
            <BottomNav total={users.length} selected={selected} onClick={handleLinkClick} />
            {/* Vote Component */}
            <div className="modal fade" id="vote" tabIndex="-1" aria-labelledby="voteLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row g-3">
                                    {candidates.length === 0 ? (
                                        <div>No candidates found.</div>
                                    ) : (
                                        candidates.map((user) => (
                                            <div key={user.Id} className="col-12 d-flex align-items-center justify-content-between p-2 bg-light rounded-3 shadow-sm">
                                                <p className='m-0 fw-bold text-capitalize'>{user.name}</p>
                                                <button className="btn btn-outline-success" onClick={() => vote(user.uid)}>
                                                    <BsFillHandIndexThumbFill className='text-dark' />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Participants List Modal */}
            <div className="modal fade" id="participantsList" tabIndex="-1" aria-labelledby="participantsListLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-10">
                                        <input type="text" className='form-control' placeholder='Search for participantes' />
                                    </div>
                                    <div className="col-2">
                                        <button className="btn btn-success" onClick={() => { }}>Add</button>
                                    </div>
                                    <form className="container p-3">
                                        <div className="row g-2">
                                            {users.map((user) => (
                                                <div key={user.uid} className="col-12 shadow-sm p-2 bg-light d-flex align-items-center justify-content-between">
                                                    <p className='m-0 text-capitalize fw-bold'>{user.name}</p>
                                                    <input type="checkbox" value={user.uid} onChange={(e) => addCandidate(e, user)} />
                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
