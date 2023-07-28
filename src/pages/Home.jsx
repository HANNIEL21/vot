import React, { useEffect, useState } from 'react';
import { BottomNav, ParticipantScreen, ChartScreen } from '../Export';
import { BsFillHandIndexThumbFill } from 'react-icons/bs';
import { HiClipboardDocumentCheck } from 'react-icons/hi2';
import { MdSecurity } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { onValue, ref } from 'firebase/database';
import { db } from '../server/firebase';
import { vote } from '../server/host';

const Home = () => {
    const [selected, setSelected] = useState("1");
    const [checkedValues, setValues] = useState([]);
    const [users, setUsers] = useState([]);

    const { pollID } = useParams();


    useEffect(() => {
        const userRef = ref(db, `${pollID}/participants/`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                const userList = Object.values(data); // Convert object to array
                setUsers(userList);
            }
        }, (error) => {
            console.error("Error fetching data:", error);
        });
    }, [pollID]);


    const addCandidate = async (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setValues((prev) => [...prev, value]);
        }
    }

    console.log(checkedValues);

    const handleLinkClick = (link) => {
        setSelected(link);
    }




    return (
        <div className='min-vh-100 bg-white'>
            <div className="dropdown">
                <button className="btn btn-transparent security dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <MdSecurity className='fs-3 m-0 text-dark' />
                </button>
                <ul className="dropdown-menu p-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <p className='fw-bold m-0 '>SectionID: {pollID}</p>
                        <button className="btn btn-transparent m-0" type="button">
                            <HiClipboardDocumentCheck className='m-0 text-dark' />
                        </button>
                    </div>
                </ul>
            </div>
            <main >
                {
                    selected === "1" && (
                        <ChartScreen />
                    )
                }
                {
                    selected === "2" && (
                        <ParticipantScreen participantes={users} />
                    )
                }
            </main>
            <BottomNav total={users.length} selected={selected} onClick={handleLinkClick} />
            {/* Vote Component */}
            <div className="modal fade" id="vote" tabindex="-1" aria-labelledby="voteLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row g-3">
                                    {
                                        users.map((user) => (
                                            <div key={user.Id} className="col-12 d-flex align-items-center justify-content-between p-2 bg-light rounded-3 shadow-sm">
                                                <p className='m-0 fw-bold text-capitalize'>{user.name}</p>
                                                <button className="btn btn-outline-success" onClick={() => vote(user.uid,)} >
                                                    <BsFillHandIndexThumbFill className='text-dark' />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Participants List Modal */}
            <div class="modal fade" id="participantsList" tabindex="-1" aria-labelledby="participantsListLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-10">
                                        <input type="text" className='form-control' placeholder='Search for participantes' />
                                    </div>
                                    <div className="col-2">
                                        <button className="btn btn-success" onClick={() => {

                                        }}>Add</button>
                                    </div>

                                    <form className="container p-3">
                                        <div className="row g-2">
                                            {
                                                users.map((user) => (
                                                    <div key={user.uid} className="col-12 shadow-sm p-2 bg-light d-flex align-items-center justify-content-between">
                                                        <p className='m-0 text-capitalize fw-bold'>{user.name}</p>
                                                        <input type="checkbox" value={user.uid} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home