import { useState } from 'react';
import { BsFillPersonFill, BsPlusSquareFill } from 'react-icons/bs';
import { BiSolidBarChartAlt2 } from 'react-icons/bi';
import { Time } from '../Export';
import { hostPoll, joinPoll } from '../server/host';

const Root = () => {
    const [email, setEmail] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [pollId, setPollId] = useState("");
    const [hostName, setHostName] = useState("");

    return (
        <div className='container-fluid min-vh-100 bg-white'>
            <div className="row align-items-center justify-content-center">
                <div className="col-12 d-flex align-items-center justify-content-end p-2 dropdown mb-5">
                    <button className="btn btn-light shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {loggedIn ? <h2 className='text-uppercase fw-bold m-0'>{email.charAt(0)}</h2> : <BsFillPersonFill />}
                    </button>
                    {
                        loggedIn ? <ul className="dropdown-menu">
                            <li><button className="btn btn-light">logout</button></li>
                        </ul> : <ul className="dropdown-menu">
                            <li><a className="dropdown-item fw-bold text-capitalize" href="/signup">sign up</a></li>
                            <li><a className="dropdown-item fw-bold text-capitalize" href="/login">login</a></li>
                        </ul>
                    }
                </div>
                <div className="col-12 text-center mb-5">
                    <Time />
                </div>
                <div className="col-11 col-md-5 d-flex align-items-center justify-content-center">
                    <div className="container">
                        <div className="row d-flex justify-content-between">
                            <button type="button" className="col-5 btn btn-light shadow rounded-3 p-4 p-lg-5 text-capitalize fs-4 fw-bold" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                <BiSolidBarChartAlt2 />
                                <h4 className='text-capitalize fw-bold'>Host</h4>
                            </button>

                            <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header border-0">
                                            <h1 className="modal-title fs-5 fw-bold text-capitalize" id="exampleModalLabel">host a poll</h1>
                                        </div>
                                        <div className="modal-body border-0">
                                            <form>
                                                <div className="mb-3">
                                                    <input type="text" className="form-control" placeholder='Enter Name' id="exampleInputEmail1" value={hostName} onChange={(e) => setHostName(e.target.value)} />
                                                </div>
                                            </form>

                                        </div>
                                        <div className="modal-footer border-0">
                                            <button className="btn btn-danger text-uppercase fw-bold" data-bs-dismiss="modal">Cancel</button>
                                            <button onClick={() => hostPoll(hostName)} className="btn btn-primary text-uppercase fw-bold">host</button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <button type="button" className="col-5 btn btn-light shadow rounded-3 p-4 p-lg-5 text-capitalize fs-4 fw-bold" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                <BsPlusSquareFill />
                                <h4 className='text-capitalize fw-bold'>Join</h4>
                            </button>

                            <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header border-0">
                                            <h1 className="modal-title fs-5 fw-bold text-capitalize" id="exampleModalLabel">join a poll</h1>
                                        </div>
                                        <div className="modal-body border-0">
                                            <form>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputPassword1" className="form-label text-capitalize fw-bold">enter room id</label>
                                                    <input type="text" className="form-control" id="exampleInputPassword1" value={pollId} onChange={(e) => setPollId(e.target.value)} />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="exampleInputEmail1" className="form-label text-capitalize fw-bold">enter name</label>
                                                    <input type="text" className="form-control" id="exampleInputEmail1" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </form>

                                        </div>
                                        <div className="modal-footer border-0">
                                            <button type="button" className="btn btn-danger text-uppercase fw-bold" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" className="btn btn-primary text-uppercase fw-bold" onClick={() => joinPoll(name, pollId)}>join</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Root