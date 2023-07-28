import React from 'react';
import styled from "styled-components";
import { ListTile } from "../Export";

const ParticipantList = ({ show, data }) => {
  const List = styled.div`
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    height: 600px;
    display: ${props => props.$show || "none"};
    width: 300px;
    `
  return (
    <List $show={show}>
      <div className="container-fluid bg-light rounded-3">
        <div className="row">
          <input type="text" placeholder='Search for participants' className='col-12 mb-3 p-2 form-control shadow-sm' />
          <div className="container-fluid overflow-scroll" style={{ height: "538px" }} >
            <div className="row p-3" >
              {
                data.map((item) => (
                  <ListTile key={item.id} data={item.name} />
                ))
              }
            </div>
          </div>

        </div>
      </div>
    </List>
  )
}

export default ParticipantList