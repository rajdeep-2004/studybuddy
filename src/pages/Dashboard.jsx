import React from "react";
import "../components/Dashboard.css"
import Navbar from "../components/Navbar/Navbar";
import StudyGroupCard from "../components/StudyGroupCard";
import ResourceCard from "../components/ResourceCard";
import SessionCard from "../components/SessionCard";
import QuickActions from "../components/QuickActions";

function Dashboard() {
    return (
        <div className="dashboard">
            <Navbar />
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
                            title="Advanced Calculus Study Group"
                            tags={["Calculus", "Mathematics", "Engineering"]}
                            members={8}
                            joined
                        />
                        <StudyGroupCard
                            title="Introduction to Psychology"
                            tags={["Psychology", "Social Sciences"]}
                            members={12}
                            joined
                        />
                        <StudyGroupCard
                            title="Introduction to Psychology"
                            tags={["Psychology", "Social Sciences"]}
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
                                title="Calculus Cheat Sheet"
                                author="Michael Brown"
                                date="May 2, 2025"
                            />
                            <ResourceCard
                                title="Psychology Terms Glossary"
                                author="Emily Chen"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Psychology Terms Glossary"
                                author="Emily Chen"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Psychology Terms Glossary"
                                author="Emily Chen"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Psychology Terms Glossary"
                                author="Emily Chen"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Psychology Terms Glossary"
                                author="Emily Chen"
                                date="May 1, 2025"
                            />
                            <ResourceCard
                                title="Psychology Terms Glossary"
                                author="Emily Chen"
                                date="May 1, 2025"
                            />
                        </div>
                    </div>

                    <div className="quick-right">
                        <QuickActions />
                        <div className="sessions">
                            <h3>Upcoming Sessions</h3>
                            <SessionCard
                                title="Calculus Exam Preparation"
                                group="Advanced Calculus Study Group"
                                host="John Smith"
                                date="Sat, May 10"
                                time="3:00 PM (1.5 hours)"
                                participants={5}
                            />
                            <SessionCard
                                title="Psychology Research Methods"
                                group="Introduction to Psychology"
                                host="Emily Chen"
                                date="Mon, May 12"
                                time="5:00 PM (1 hour)"
                                participants={6}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
