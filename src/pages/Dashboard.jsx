import React, { use, useEffect, useState } from "react";
import { useUserData } from "../context/UserDataContext";
import { doc, getDocs, collection, getDoc, query } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";

/** Reusable Summary Card */
function SummaryCard({ icon, label, value, sign }) {
  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center shadow-sm">
      <div className="text-lg font-medium text-gray-700 flex items-center gap-2">
        <span>{label}</span>
      </div>
      <div className="text-3xl font-semibold text-black">{value}<span className="text-3xl font-semibold text-black">{sign}</span></div>
    </div>
  );
}

export default function Dashboard() {
  const { userData } = useUserData();
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsNo, setSessionsNo] = useState(0);
  const [resourcesNo, setResourcesNo] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);
  const firstName = userData?.name || "User";

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userData?.joinedGroups || userData.joinedGroups.length === 0) {
        setLoading(false);
        return;
      }

      const groupPromises = userData.joinedGroups.map(async (groupId) => {
        const ref = doc(db, "groups", groupId);
        const snap = await getDoc(ref);
        return { id: groupId, ...snap.data() };
      });

      const results = await Promise.all(groupPromises);
      setGroupData(results);

      setSessionsNo(userData.sessionsCreated);
      setResourcesNo(userData.resourcesShared);
      setTotalTodos(userData.totalTodos);
      setCompletedTodos(userData.completedTodos);

      setLoading(false);
    };

    if (userData) {
      fetchGroups();
    }
  }, [userData]);

  if (loading || userData === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl font-medium">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600">
            Ready to crush your study goals today? 🚀
          </p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6 mb-10">
          <SummaryCard label="Your Groups" value={groupData.length} sign="" />
          <SummaryCard label="Upcoming Sessions" value={sessionsNo} sign="" />
          <SummaryCard label="Resources Shared" value={resourcesNo} sign="" />
          <SummaryCard
            label="Task Completition Rate"
            value={
              totalTodos > 0
                ? Math.round((completedTodos / totalTodos) * 100)
                : 0
            }
            sign="%"
          />
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
