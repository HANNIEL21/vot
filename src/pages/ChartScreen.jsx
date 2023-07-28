import React, { useEffect, useState } from 'react';
import { Chart } from '../Export';
import { onValue, ref } from 'firebase/database';
import { db } from '../server/firebase';
import { useParams } from 'react-router-dom';


const ChartScreen = () => {
  const [candidates, setCandidates] = useState([]);
  const [participants, setParticipantes] = useState([]);

  const {sectionID} =  useParams();

  useEffect(() => {
    const participantesRef = ref(db, `${sectionID}/participants/`);
    const candidateRef = ref(db, `${sectionID}/Candidates/`);

    const fetchData = () => {
      onValue(participantesRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const participantesList = Object.values(data);
          setParticipantes(participantesList);
          console.log(participantesList);
        }
      }, (error) => {
        console.error("Error fetching data for participants:", error);
      });

      onValue(candidateRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const candidatesList = Object.values(data); 
          setCandidates(candidatesList);
          console.log(candidates);
        }
      }, (error) => {
        console.error("Error fetching data for candidates:", error);
      });
    };

    fetchData();
  }, [candidates, sectionID]);


  return (
    <div className='min-vh-100 d-flex justify-content-center align-items-end p-5'>
      <Chart candidates={candidates} total={participants.length} />
    </div>
  )
}

export default ChartScreen