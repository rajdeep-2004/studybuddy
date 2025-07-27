import React, { useState } from "react";
import { db } from "../firebase.jsx";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { useUserData } from "../context/UserDataContext.jsx";
import { useNavigate } from "react-router-dom";

export default function JoinGroup() {
  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const { userData } = useUserData();
  const navigate = useNavigate();

  const handleJoinGroup = async () => {
    if (!groupName || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const q = query(
        collection(db, "groups"),
        where("groupName", "==", groupName),
        where("username", "==", username)
      );

      const snapshot = await getDocs(q);


      if (snapshot.empty) {
        alert("No group found with that name and username.");
        return;
      }

      const groupDoc = snapshot.docs[0];
      const groupData = groupDoc.data();


      if (groupData.password !== password) {
        alert("Incorrect password.");
        return;
      }

      const groupRef = doc(db, "groups", groupDoc.id);
      const userObj = {
        name: userData.name,
        uid: userData.uid,
        avatar: userData.avatar
      };
      await updateDoc(groupRef, {
        members: arrayUnion(userObj),
        memberCount: groupData.memberCount + 1,
      });

      const todosSnapshot = await getDocs(
        collection(db, "groups", groupDoc.id, "todos")
      );
      const todoCount = todosSnapshot.size;

      const sessionsSnapshot = await getDocs(
        collection(db, "groups", groupDoc.id, "sessions")
      );
      const sessionsCount = sessionsSnapshot.size;

      const userRef = doc(db, "users", userData.uid);
      await updateDoc(userRef, {
        joinedGroups: arrayUnion(groupDoc.id),
        totalTodos: increment(todoCount),
        upcomingSessions: increment(sessionsCount)
      });

      setLogin(false)
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-10">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6">Join a Study Group</h2>

        <div className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., WAP 101"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Group Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., wap-section-b"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Group Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter group password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleJoinGroup}
              className="bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] text-white px-5 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              {login ? "Joining" : "Join Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
