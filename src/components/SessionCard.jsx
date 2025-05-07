import React from "react";

function SessionCard({ title, group, date, time, participants, host }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p><strong>{group}</strong></p>
      <p>📅 {date}</p>
      <p>⏰ {time}</p>
      <p>👥 {participants} participants</p>
      <p>🎤 Host: {host}</p>
      <button className="join-btn">Join Session</button>
    </div>
  );
}

export default SessionCard;
