import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";

export default function Members() {
  const { groupID } = useParams();
  const { userData } = useUserData();

  const [members, setMembers] = useState([]);
  const [groupCreatorName, setGroupCreatorName] = useState("");
  const [groupCreatorUID, setGroupCreatorUID] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const groupRef = doc(db, "groups", groupID);
        const groupSnap = await getDoc(groupRef);
        const groupData = groupSnap.data();

        const memberNames = groupData.members || [];
        setGroupCreatorName(groupData.createdBy[0]);
        setGroupCreatorUID(groupData.createdBy[1]);

        const usersSnap = await getDocs(collection(db, "users"));
        const allUsers = usersSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

        // Match member names with user objects
        const matchedMembers = memberNames
          .map((name) => allUsers.find((user) => user.name === name))
          .filter((user) => user); // remove undefined if any name doesn't match

        setMembers(matchedMembers);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, [groupID]);

  const handleRemove = async (nameToRemove) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      const groupRef = doc(db, "groups", groupID);
      const groupSnap = await getDoc(groupRef);
      const groupData = groupSnap.data();

      const updatedMembers = groupData.members.filter((name) => name !== nameToRemove);

      await setDoc(groupRef, { ...groupData, members: updatedMembers });
      setMembers((prev) => prev.filter((mem) => mem.name !== nameToRemove));
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">👥 Group Members</h2>

      {members.length === 0 ? (
        <div className="text-gray-500 italic">No members found.</div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-4">
          {members.map((mem) => (
            <div
              key={mem.uid}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <p className="text-sm text-gray-600 break-all">
                <span className="font-semibold">Name:</span> {mem.name}
              </p>
              <p className="text-sm mt-1">
                <span className="font-semibold">Role:</span>{" "}
                {mem.name === groupCreatorName ? "Admin" : "Member"}
              </p>
              {userData.uid === groupCreatorUID && mem.name !== groupCreatorName && (
                <button
                  onClick={() => handleRemove(mem.name)}
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
