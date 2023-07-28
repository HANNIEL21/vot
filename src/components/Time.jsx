import React, { useEffect, useState } from 'react'

const Time = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        setInterval(() => setTime(new Date()), 1000);
    }, [])


    return (
            <h1 className='display-1 fw-bold m-0 text-dark'>{time.toDateString()}</h1>
    )
}

export default Time