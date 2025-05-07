import React from "react";

function StudyGroupCard({ title, tags, members, joined }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>A group for students to collaborate and solve problems together.</p>
      <div className="tags">
        {tags.map(tag => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
      <p><strong>{members}</strong> members</p>
      <p style={{ color: "green" }}>{joined ? "Joined" : "Not Joined"}</p>
    </div>
  );
}

export default StudyGroupCard;
