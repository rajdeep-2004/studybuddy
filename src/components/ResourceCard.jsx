import React from "react";

function ResourceCard({ title, author, date }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>A resource uploaded by <strong>{author}</strong></p>
      <p className="meta">📅 {date}</p>
      <button className="view-btn">View</button>
    </div>
  );
}

export default ResourceCard;
