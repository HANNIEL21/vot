import React, { useEffect, useState } from 'react';
import { Chart } from '../Export';
import { onValue, ref, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../server/firebase';
import { useParams } from 'react-router-dom';


const ChartScreen = (participants) => {
  const [candidates, setCandidates] = useState([]);

  const { pollID } = useParams();

  useEffect(() => {
    const q = query(ref(db, pollID + '/participants/'), orderByChild("candidate"), equalTo(true));
    onValue(q, (snapshot) => {
      const candidatesArray = [];
      snapshot.forEach((childSnapshot) => {
        const candidate = childSnapshot.val();
        candidatesArray.push(candidate);
      });
      setCandidates(candidatesArray);
    });
  }, [pollID]);


  return (
    <div className='min-vh-100 d-flex justify-content-center align-items-end p-5'>
      <Chart candidates={candidates} total={participants.length} />
    </div>
  )
}

export default ChartScreen