import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";
import { getRandomColorCombo } from "../../utils/ColourCombos.jsx";

export default function Members() {
  const { groupID } = useParams();
  const { userData } = useUserData();

  const [members, setMembers] = useState([]);
  const [groupCreatorName, setGroupCreatorName] = useState("");
  const [groupCreatorUID, setGroupCreatorUID] = useState("");

  useEffect(() => {
    const groupRef = doc(db, "groups", groupID);
    const groupUnsubscribe = onSnapshot(groupRef, (groupSnap) => {
      const groupData = groupSnap.data();
      const memberNames = groupData.members || [];
      setGroupCreatorName(groupData.createdBy[0]);
      setGroupCreatorUID(groupData.createdBy[1]);
      setMembers(memberNames);
    });

    return () => groupUnsubscribe();
  }, [groupID]);

  const handleDeleteUser = async (memberName, memberUID) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const groupRef = doc(db, "groups", groupID);
    const groupSnap = await getDoc(groupRef);
    const groupData = groupSnap.data();
    const updatedMembers = groupData.members.filter(
      (members) => members.name !== memberName
    );
    await updateDoc(groupRef, { members: updatedMembers });
    await updateDoc(groupRef, { memberCount: groupData.memberCount - 1 });

    const deluserRef = doc(db, "users", memberUID);
    const deluserSnap = await getDoc(deluserRef);
    const deluserData = deluserSnap.data();
    const updatedjoinedGroups = deluserData.joinedGroups.filter(
      (groupid) => groupid !== groupID
    );
    await updateDoc(deluserRef, { joinedGroups: updatedjoinedGroups });
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
                key={mem.uid}
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
                        onClick={() => handleDeleteUser(mem.name, mem.uid)}
                      >
                        Remove
                      </button>
                    )}
                </div>
                <img src={mem.avatar} alt="Avatar" className="h-10" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
