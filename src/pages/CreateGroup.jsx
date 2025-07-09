import React, { useState } from "react";
import { db } from "../firebase.jsx";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { useUserData } from "../context/UserDataContext.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");
  const { userData } = useUserData();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    setImageURL(e.target.value);
  };

  const handleCreateGroup = async () => {
    if (!groupName || !username || !description || !password || !imageURL) {
      alert("Please fill in all fields.");
      return;
    }

    const groupData = await addDoc(collection(db, "groups"), {
      groupName: groupName,
      username: username,
      description: description,
      password: password,
      imageURL: imageURL,
      createdBy: [userData.name, userData.uid],
      createdTime: Date.now(),
      members: [userData.name],
      memberCount: 1,
      pinnedAnnouncement: "",
    });

    const userRef = doc(db, "users", userData.uid);
    await updateDoc(userRef, {
      joinedGroups: arrayUnion(groupData.id),
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-10">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6">
          Create a New Study Group
        </h2>

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
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your group's focus and goals."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Group Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a group password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Upload Group Image URL
            </label>
            <input
              type="url"
              onChange={(e) => setImageURL(e.target.value)}
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleCreateGroup}
              className="bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] text-white px-5 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
