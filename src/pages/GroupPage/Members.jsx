import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useUserData } from "../../context/UserDataContext.jsx";
import { getRandomColorCombo } from "../../utils/ColourCombos.jsx";

export default function Members() {
  const { groupID } = useParams();
  const { userData } = useUserData();

  const [members, setMembers] = useState([]);
  const [groupCreatorName, setGroupCreatorName] = useState("");
  const [groupCreatorUID, setGroupCreatorUID] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/groups/${groupID}`);
        setMembers(res.data.members);
        // createdBy is just an ID in the group object unless populated.
        // But wait, get /:id populates members.
        // It does NOT populate createdBy.
        // So res.data.createdBy is an ID.
        setGroupCreatorUID(res.data.createdBy);
        
        // Find creator name from members list if they are in it (they should be)
        const creator = res.data.members.find(m => m._id === res.data.createdBy);
        if (creator) {
            setGroupCreatorName(creator.name);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, [groupID]);

  const handleDeleteUser = async (memberName, memberUID) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/groups/${groupID}/members/${memberUID}`);
      setMembers((prev) => prev.filter((m) => m._id !== memberUID));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Group Members</h2>

      {members.length === 0 ? (
        <div className="text-gray-500 italic">No members found.</div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-4">
          {members.map((mem) => {
            const { bg, border } = getRandomColorCombo();
            return (
              <div
                key={mem._id}
                className={`${bg} ${border} p-4 rounded-lg shadow hover:shadow-md transition flex justify-between`}
              >
                <div>
                  {" "}
                  <p className="text-sm text-gray-600 break-all">
                    <span className="font-semibold">Name:</span> {mem.name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Role:</span>{" "}
                    {mem.name === groupCreatorName ? "Admin" : "Member"}
                  </p>
                  {userData.uid === groupCreatorUID &&
                    mem.name !== groupCreatorName && (
                      <button
                        className="bg-red-300 text-sm mt-2 rounded-lg px-2"
                        onClick={() => handleDeleteUser(mem.name, mem._id)}
                      >
                        Remove
                      </button>
                    )}
                </div>
                <img src={mem.avatar || `https://ui-avatars.com/api/?name=${mem.name}`} alt="Avatar" className="h-10 rounded-full" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
