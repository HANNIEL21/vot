import React from 'react';
import { Avatar } from "../Export";

const Participants = ({user}) => {
  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center my-5" style={{ height: "70px", width: "700px" }}>
        {
          user.map((item)=> (
            <Avatar name={item.name.charAt(0).toUpperCase()} key={item.id} />
          ))
        }
      </div>
    </>
  )
}

export default Participants