import React, { useState } from 'react';
import "../components/SessionCard.css"
function SessionCard({ title, group, date, time, duration,participants, host }) {

  const [showMessage, setShowMessage] = useState(false);
  
  function handleClick() {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000); 
  }

  return (
    <div className="card">
      <h4>{title}</h4>
      <p><strong>{group}</strong></p>
      <p>📅 {date}</p>
      <p>⏰ {time}</p>
      <p>👥 {participants} participants</p>
      <p>🎤 Host: {host}</p>
      <p>Duration: {duration}</p>
      <button className="join-btn" onClick={handleClick}>Join Session</button>

      {showMessage && (
        <div className='pop'>
         <strong>Session joined</strong>
         <div>You've successfully joined this study session</div>
        </div>
      )}
    </div>
  );
}

export default SessionCard;
