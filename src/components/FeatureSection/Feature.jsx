import React from 'react';
import './Feature.css'; 

const features = [
  {
    icon: 'src/assets/people.png',
    title: 'Form Study Groups',
    description:
      'Connect with peers who are studying the same subjects. Create or join study groups based on your courses and interests.',
  },
  {
    icon: 'src/assets/book.png',
    title: 'Share Resources',
    description:
      'Upload study materials, notes, and helpful links. Access a library of resources shared by your group members.',
  },
  {
    icon: 'src/assets/calendar.png',
    title: 'Schedule Sessions',
    description:
      'Plan and organize study sessions. Set topics, dates, and times that work for everyone in your group.',
  },
];

function Feature() {
  return (
    <section className="features-section">
      <h2 className="features-title">
        Everything You Need to Study Effectively
      </h2>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <img className="feature-icon" src ={feature.icon} style={{height:"50px"}}/>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
          </div>
        ))}
      </div>

      <button className="features-button">Explore Features</button>
    </section>
  );
}

export default Feature