import React from "react";
import "../components/Dashboard.css"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import StudyGroupCard from "../components/StudyGroupCard";
import ResourceCard from "../components/ResourceCard";
import SessionCard from "../components/SessionCard";
import QuickActions from "../components/QuickActions";

function Dashboard() {
    return (
        <div className="dashboard">
            <Navbar />
            <hr></hr>
            <div className="main-container">
                <h2 className="title">Dashboard</h2>
                <div className="group">
                    <p className="subtitle">Welcome back! Here's an overview of your study activities.</p>
                    <div className="open-group">
                        <button>Join Group</button>
                        <button>Create Group</button>
                    </div>
                </div>
                <section className="study-groups">
                    <h3>My Study Groups</h3>
                    <div className="cards-row">
                        <StudyGroupCard
                            title="DSA"
                            tags={["Trees", "Recursion", "Prefix Sum"]}
                            members={8}
                            joined
                        />
                        <StudyGroupCard
                            title="WAP"
                            tags={["React JS", "JavaScript"]}
                            members={10}
                            joined
                        />
                        <StudyGroupCard
                            title="MTH"
                            tags={["Probability", "Statistics"]}
                            members={12}
                            joined
                        />
                    </div>
                </section>

                <section className="resources-sessions">
                    <div className="resources-outer">
                        <h3>Recent Resources</h3>

                        <div className="resources-inner">

                            <ResourceCard
                                title="DSA Cheat Sheet"
                                author="Rajdeep Sanyal"
                                date="May 2, 2025"
                            />
                            <ResourceCard
                                title="Probability Notes"
                                author="Piyush Yadav"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Statistics Short Notes"
                                author="Rohan Singh"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Tech and Policy Notes"
                                author="Aryan"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="POD Designs"
                                author="Suryansh"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Figma Prototype"
                                author="Anand"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Hackathon Resources"
                                author="Rajdeep"
                                date="May 1, 2025"
                            />
                        </div>
                    </div>

                    <div className="quick-right">
                        <QuickActions />
                        <div className="sessions">
                            <h3>Upcoming Sessions</h3>
                            <SessionCard
                                title="DSA End Sem"
                                group="Group 101"
                                host="Rajdeep"
                                date="Sat, May 8"
                                time="3:00 PM"
                                duration = "1.5 hours"
                                participants={5}
                            />
                            <SessionCard
                                title="WAP End Sem"
                                group="Group 234"
                                host="Aditya Kumar"
                                date="Mon, May 12"
                                time="5:00 PM"
                                duration = "1 hour"
                                participants={6}
                            />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
