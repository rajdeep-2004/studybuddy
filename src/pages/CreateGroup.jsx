import React, { useState } from "react";
import api from "../api/axios";
import { useUserData } from "../context/UserDataContext";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [create, setCreate] = useState(false);
  const { userData } = useUserData();
  const navigate = useNavigate();

  const handleuploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/groups/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageURL(res.data.url);
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || !username || !description || !password || !imageURL) {
      alert("Please fill in all fields.");
      return;
    }
    setCreate(true);

    try {
      await api.post("/groups", {
        groupName,
        username,
        description,
        password,
        imageURL,
      });
      
      // User joinedGroups update is handled by backend
      
      setCreate(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Create group error:", err);
      alert("Failed to create group");
      setCreate(false);
    }
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Group Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., wap-section-b"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your group's focus and goals."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Group Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a group password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Upload Group Image URL
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleuploadImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)]"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleCreateGroup}
              className="bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] text-white px-5 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              {create ? "Creating Group..." : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
