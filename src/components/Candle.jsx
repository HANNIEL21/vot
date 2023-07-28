import React from 'react';
import styled from 'styled-components';


const Candle = ({ bgcolor, height, count }) => {
  const Candle = styled.div`
    padding: 20px;
    height: ${props => props.$height || "30px"};
    width: 50px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, .4);
    background: linear-gradient(#E74C3C,#E67E22,#F1C40F,#27AE60,#3498DB);
    };
  `;

  return (
    <>
      <Candle $height={height} $bgcolor={bgcolor}>
        <h2 className='text-light m-0'>{count}</h2>
      </Candle>
    </>
  );
};

export default Candle;