import React, { useEffect, useState } from "react";
import { db } from "../../firebase.jsx";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";

export default function Sessions() {
  const { groupID } = useParams();
  const { currentUser } = useAuth();
  const { userData } = useUserData();

  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [groupMembers, setGroupMembers] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "groups", groupID, "sessions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // sort by session date

      setSessions(sessionList);
    });

    const getGroupData = async () => {
      const groupRef = doc(db, "groups", groupID);
      const groupSnap = await getDoc(groupRef);
      setGroupMembers(groupSnap.data().members);
    };

    getGroupData();

    return () => unsubscribe();
  }, [groupID]);

  const handleCreateSession = async () => {
    if (!title || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "groups", groupID, "sessions"), {
        title,
        date,
        time,
        link,
        createdBy: {
          uid: userData.uid,
          name: userData.name,
        },
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDate("");
      setTime("");
      setLink("");
      setShowForm(false);

      for (const member of groupMembers) {
        const userRef = doc(db, "users", member.uid);
        const userdata = (await getDoc(userRef)).data();
        await updateDoc(userRef, {
          upcomingSessions: userdata.upcomingSessions + 1,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSession = async (sessionID) => {
    try {
      const confirmDelete = confirm("Are you sure?");
      if (!confirmDelete) return;
      await deleteDoc(doc(db, `groups/${groupID}/sessions/${sessionID}`));

      for (const member of groupMembers) {
        const userRef = doc(db, "users", member.uid);
        const userdata = (await getDoc(userRef)).data();
        await updateDoc(userRef, {
          upcomingSessions: userdata.upcomingSessions - 1,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Upcoming Sessions
      </h2>

      {sessions.length === 0 ? (
        <div className="text-gray-500 italic bg-white p-6 rounded-lg shadow">
          No upcoming sessions. Create one?
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-3 ">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-2xl transition"
            >
              <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Date:</span> {session.date}
              </p>
              <p className="text-gray-600 ">
                <span className="font-semibold">Time:</span> {session.time}
              </p>
              {session.link && (
                <p>
                  <span className="text-gray-600 mb-1 font-semibold">
                    Link:{" "}
                  </span>
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all text-sm mb-1"
                  >
                    {session.link}
                  </a>
                </p>
              )}
              <div className="flex justify-between ">
                <p className="mt-2 text-gray-500">
                  <span className="font-semibold">Created By: </span>
                  {session.createdBy.uid === currentUser.uid
                    ? "You"
                    : session.createdBy.name}
                </p>
                {session.createdBy.uid === currentUser.uid ? (
                  <button
                    className="bg-red-300 rounded-lg px-2 mt-2"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    {" "}
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* create button */}
      {!showForm && (
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 rounded-lg text-white bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition"
          >
            Create Session
          </button>
        </div>
      )}

      {/* new session form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h3 className="text-lg font-semibold mb-4">New Session Details</h3>

          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Session Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex gap-6 items-center">
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste Meet Link (optional)"
                className="w-300 border border-gray-300 rounded-lg px-4 py-2"
              />
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-white bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition"
              >
                Create Meeting
              </a>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateSession}
                className="p-2 rounded-lg text-white bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition"
              >
                Save Session
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg text-black bg-gray-300 border-2 border-gray-300 hover:bg-white hover:text-black transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}