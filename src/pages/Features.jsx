import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Features.css"

const features = [
  {
    title: "Create & Join Study Groups",
    tag: "Collaboration",
    description:
      "Invite friends or join via password-protected groups. Focused communities built around your study needs.",
    color: "bg-orange-50 text-orange-700",
    border: "border-orange-200",
  },
  {
    title: "Personal Dashboard",
    tag: "Overview",
    description:
      "View your study groups, tasks, and sessions in one place — beautifully organized.",
    color: "bg-blue-50 text-blue-700",
    border: "border-blue-200",
  },
  {
    title: "Calendar View",
    tag: "Scheduling",
    description:
      "Visualize all upcoming sessions using a modern calendar (powered by react-big-calendar).",
    color: "bg-purple-50 text-purple-700",
    border: "border-purple-200",
  },
  {
    title: "Task Management",
    tag: "Productivity",
    description:
      "Add and complete todos that help keep you accountable and on track inside your study groups.",
    color: "bg-green-50 text-green-700",
    border: "border-green-200",
  },
  {
    title: "Schedule Sessions",
    tag: "Planning",
    description:
      "Add sessions with title, link, date, and time. Everyone in the group is notified.",
    color: "bg-red-50 text-red-700",
    border: "border-red-200",
  },
  {
    title: "Group Chat",
    tag: "Real-Time",
    description:
      "Communicate with group members in real-time using our built-in group chat (beta version).",
    color: "bg-yellow-50 text-yellow-700",
    border: "border-yellow-200",
  },
  {
    title: "Share Resources",
    tag: "File Sharing",
    description:
      "Upload PDFs, links, and notes — everything is easily accessible to your group members.",
    color: "bg-pink-50 text-pink-700",
    border: "border-pink-200",
  },
  {
    title: "Team Members Tab",
    tag: "Visibility",
    description:
      "See who's in your study squad and check details instantly from within each group.",
    color: "bg-teal-50 text-teal-700",
    border: "border-teal-200",
  },
  {
    title: "Upcoming Sessions",
    tag: "Reminders",
    description:
      "Always stay aware of your next scheduled sessions — never miss a beat.",
    color: "bg-indigo-50 text-indigo-700",
    border: "border-indigo-200",
  },
  {
    title: "Unique Avatars",
    tag: "Identity",
    description:
      "Every student gets a visually distinct avatar — instantly recognizable inside any group.",
    color: "bg-cyan-50 text-cyan-700",
    border: "border-cyan-200",
  }, 
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-16">
        <div className=" mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 features-text">
            Organized · Collaborative · Productive{" "}
          </h1>
          <div className="grid grid-cols-5 gap-8 features">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative group p-6 rounded-2xl h-70 border shadow-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] ${feature.color} ${feature.border}`}
              >

                <div className="absolute inset-0 bg-white/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl pointer-events-none z-0" />

                {/* Card Content */}
                <div className="relative z-10">
                  <p className="inline-block text-sm font-semibold bg-white/70 px-3 py-1 rounded-full mb-3 shadow-sm">
                    {feature.tag}
                  </p>
                  <h3 className="text-xl font-bold mb-10">{feature.title}</h3>
                  <p className="text-sm text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/signup">
              <button className="bg-[rgb(115,193,253)] border-[rgb(115,193,253)] border-2 text-white px-8 py-3 rounded-lg text-lg  hover:bg-white hover:text-black transition">
                Create Your First Study Group{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
