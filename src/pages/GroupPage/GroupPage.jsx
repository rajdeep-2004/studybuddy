import React, { useState, useEffect } from "react";
import { db } from "../../firebase.jsx";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";
import editIcon from "../../assets/editicon.png";
import Sidebar from "../../components/SideBar.jsx";
import Sessions from "./Sessions.jsx";
import Todo from "./Todo.jsx";
import Resources from "./Resources.jsx";
import Members from "./Members.jsx";
import Chat from "./Chat.jsx";

export default function GroupPage() {
  const { currentUser } = useAuth();
  const { userData } = useUserData();
  const navigate = useNavigate();
  const { groupID } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [pinnedText, setPinnedText] = useState("");
  const [nextSession, setNextSession] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!userData?.uid) return;
    const fetchGroupData = async () => {
      try {
        const groupRef = doc(db, "groups", groupID);
        const group = await getDoc(groupRef);
        setGroupData(group.data());
        setPinnedText(group.data().pinnedAnnouncement || "");
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchNextSession = async () => {
      try {
        const q = query(
          collection(db, "groups", groupID, "sessions"),
          orderBy("date"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const session = snapshot.docs[0].data();
          setNextSession(session);
        }
      } catch (error) {
        console.error("Error fetching next session:", error);
      }
    };

    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.joinedGroups.includes(groupID)) {
          alert("You are no longer a member of this group.");
          navigate("/dashboard");
        }
      }
    });

    fetchGroupData();
    fetchNextSession();
    return () => unsub();
  }, [userData, groupID, navigate]);

  if (loading || !groupData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">Loading group data...</div>
      </div>
    );
  }

  const handlePinnedUpdate = async () => {
    try {
      const groupRef = doc(db, "groups", groupID);
      await updateDoc(groupRef, { pinnedAnnouncement: pinnedText });
      setEditMode(false);
      setGroupData((prev) => ({ ...prev, pinnedAnnouncement: pinnedText }));
    } catch (err) {
      console.error("Failed to update pinned comment", err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Pinned Announcement */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mb-8 shadow-sm flex items-center justify-between">
              {groupData.pinnedAnnouncement || "No pinned comment"}
              {groupData.createdBy[1] === currentUser.uid && (
                <button onClick={() => setEditMode(true)}>
                  <img src={editIcon} alt="Edit Icon" className="h-6 w-6" />
                </button>
              )}
            </div>

            {editMode && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Edit Pinned Announcement
                </h2>
                <textarea
                  value={pinnedText}
                  onChange={(e) => setPinnedText(e.target.value)}
                  className="w-full h-24 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Type your announcement here..."
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handlePinnedUpdate}
                    className="p-2 rounded-lg text-white bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition"
                  >
                    Update Announcement
                  </button>
                </div>
              </div>
            )}

            {/* Group Description */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-3">Group Description</h2>
              <div className="bg-white p-6 rounded-lg shadow text-gray-700 leading-relaxed">
                {groupData.description}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-3">Upcoming Session</h2>
              {nextSession ? (
                <div className="flex items-center justify-between mb-4 text-gray-700 bg-white p-6 rounded-lg shadow text-lg">
                  <div className="">
                    <span className="font-medium">{nextSession.title}</span> is
                    at <span className="font-semibold">{nextSession.date}</span>{" "}
                    on <span className="font-semibold">{nextSession.time}</span>
                  </div>
                  <div>
                    {nextSession.link && (
                      <a
                        href={nextSession.link}
                        target="blank"
                        className="text-[rgb(109,191,254)] hover:text-blue-500"
                      >
                        Join
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic bg-white p-6 rounded-lg shadow">
                  No upcoming sessions.
                </div>
              )}
            </div>
          </>
        );

      case "sessions":
        return <Sessions />;
      case "todos":
        return <Todo />;
      case "chat":
        return <Chat />;
      case "resources":
        return <Resources />;
      case "members":
        return <Members />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        {/*  Cover Pic */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-md">
          {!imgLoaded && (
            <div className="w-full h-72 bg-gray-300 animate-pulse rounded-xl"></div> 
          )}

          <img
            src="https://picsum.photos/1465/288"
            alt="Group Banner"
            onLoad={() => setImgLoaded(true)}
            className={`object-cover w-full h-72 transition-opacity duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Group Name */}
        <div className="  bg-opacity-40 flex items-center px-2 justify-between mb-9 text-black">
          <h1 className="text-3xl font-bold">{groupData.groupName}</h1>
        </div>

        {/* Tabs */}
        <div className="border-gray-200 mb-6">
          <nav className="flex space-x-6">
            {[
              "overview",
              "sessions",
              "todos",
              "chat",
              "resources",
              "members",
            ].map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${
                  activeTab === tab
                    ? "bg-[rgb(198,230,254)] rounded-lg p-2 transition delay-1"
                    : "text-gray-500 hover:bg-gray-200 rounded-lg p-2 transition delay-1"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "overview" && "Overview"}
                {tab === "sessions" && "Sessions"}
                {tab === "todos" && "Todos"}
                {tab === "chat" && "Chat"}
                {tab === "resources" && "Resources"}
                {tab === "members" && "Members"}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr,1fr] gap-6">
          <div>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
