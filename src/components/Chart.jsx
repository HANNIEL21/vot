import React from 'react';
import { Candle } from "../Export";

const Chart = ({ candidates, total }) => {
    
    const calculatePercentage = (value, total) => {
        if (total === 0) {
            return 0;
        }

        const percentage = (value / total) * 100;
        return Math.round(percentage * 100) / 100; // Round to 2 decimal places
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-end mb-5" style={{ height: "450px", width: "700px" }}>
                {
                    candidates.map((user) => (
                        <Candle key={user.id} height={calculatePercentage(user.count, total) + "%"} count={user.count + "%"} />
                    ))
                }
            </div>
        </>
    )
}

export default Chart