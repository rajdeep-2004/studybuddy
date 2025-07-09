import React, { useEffect, useState } from "react";
import { useUserData } from "../context/UserDataContext";
import SideBar from "../components/SideBar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { userData } = useUserData();
  const [groupData, setGroupData] = useState([]);
  const firstName = userData?.name?.split(" ")[0] || "User";

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userData?.joinedGroups || userData.joinedGroups.length === 0) return;

      const groupPromises = userData.joinedGroups.map(async (groupId) => {
        const ref = doc(db, "groups", groupId);
        const snap = await getDoc(ref);
        return { id: groupId, ...snap.data() };
      });

      const results = await Promise.all(groupPromises);
      setGroupData(results);
    };

    fetchGroups();
  }, [userData]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}!</h1>
          <p className="text-gray-600">Ready to crush your study goals today? 🚀</p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-10">
          <SummaryCard
            icon="📚"
            label="Your Groups"
            value={groupData.length}
          />
          <SummaryCard icon="📅" label="Upcoming Sessions" value={0} />
          <SummaryCard icon="📁" label="Resources Shared" value={0} />
        </div>

        {/* Your Groups */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
          {groupData.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {groupData.map((group, i) => (
                <Link to={"/group/" + group.id}>
                <div
                  key={i}
                  className="bg-white rounded-xl shadow hover:scale-105 transition p-4 flex flex-col"
                >
                  <img
                    src={group.imageURL}
                    alt={group.groupName}
                    className="h-32 w-full object-cover rounded-lg mb-4"
                  />
                  <div className="font-semibold mb-1">{group.groupName}</div>
                  <div className="text-sm text-gray-600">
                    {group.description || "No description."}
                  </div>
                </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-600 italic">
              No joined groups.{" "}
              <button className="text-blue-600 underline ml-1 hover:text-blue-800">
                Join now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Reusable Summary Card */
function SummaryCard({ icon, label, value }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center shadow-sm">
      <div className="text-lg font-medium text-gray-700 flex items-center gap-2">
        <span>{icon}</span> <span>{label}</span>
      </div>
      <div className="text-3xl font-semibold text-black">{value}</div>
    </div>
  );
}
