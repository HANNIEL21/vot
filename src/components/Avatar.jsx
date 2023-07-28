import React from 'react';
import styled from 'styled-components';

const Avatar = ({ name }) => {
  const Avatar = styled.div`
        height: 50px;
        padding: 30px;
        width: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 4px 4px 8px rgba(0, 0, 0, .4);
        background: #fff;
    `
  return (
    <Avatar>
      <h1 className='display-5 fw-bold m-0 text-dark'>{name}</h1>
    </Avatar>
  )
}

export default Avatar