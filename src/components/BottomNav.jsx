import React, { useState } from 'react';
import styled from 'styled-components';
import { MdGroups, MdGroupAdd } from 'react-icons/md';
import { BiLogOut, BiSolidBarChartAlt2 } from 'react-icons/bi';
import { BsFillHandIndexThumbFill } from 'react-icons/bs';

const BottomNav = ({ total, selected, onClick }) => {
    const [isHost, setIsHost] = useState(true);

    const handleClick = (link) => {
        onClick(link);
    };

    const BottomNavContainer = styled.div`
    width: 100%;
    height: 65px;
    padding: 0 20px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  `;

    return (
        <BottomNavContainer>
            {isHost ? (
                <button type="button" class="btn btn-transparent text-success fw-bold" data-bs-toggle="modal" data-bs-target="#participantsList">
                    <MdGroupAdd className='fs-4 text-success' />
                    <span className='d-none d-md-inline'>Add Participant</span>
                </button>
            ) : (
                <div></div>
            )}
            <div>

                <button
                    className='btn shadow-sm btn-light ms-2'
                    onClick={() => handleClick("1")}
                >
                    <BiSolidBarChartAlt2 className='fs-3 text-dark' />
                </button>

                <button type="button" className='btn shadow-sm btn-light ms-2' data-bs-toggle="modal" data-bs-target="#vote">
                    <BsFillHandIndexThumbFill className='fs-3 text-dark' />
                </button>

                <button
                    type='button'
                    className='btn shadow-sm btn-light position-relative ms-2'
                    onClick={() => handleClick("2")}
                >
                    <MdGroups className='fs-3 text-dark' />
                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                        {total}
                    </span>
                </button>
            </div>
            {isHost ? (
                <button class="btn btn-transparent text-danger fw-bold  border-0" type="button" id="button-addon2" >
                    <BiLogOut className='m-0 text-danger fw-bold' />
                    <span className='ms-1'>End Poll</span>
                </button>
            ) : (
                <button className='btn btn-transparent text-danger fw-bold'>
                    <BiLogOut className='fs-4 text-danger' />
                    <span className='d-none d-md-inline'>Leave</span>
                </button>
            )}
        </BottomNavContainer>
    );
};

export default BottomNav;
