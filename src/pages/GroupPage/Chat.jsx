import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";

export default function Chat() {
  const { groupID } = useParams();
  const { userData } = useUserData();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "groups", groupID, "chat"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(chatList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [groupID]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "groups", groupID, "chat"), {
        text: newMessage.trim(),
        senderName: userData.name,
        senderUID: userData.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[85vh] space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">💬 Group Chat</h2>

      <div className="flex flex-col flex-grow bg-gray-100 rounded-lg shadow overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderUID === userData.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words
                  ${msg.senderUID === userData.uid ? "bg-green-200 text-right" : "bg-white text-left"}`}
              >
                <div className="font-semibold text-gray-700 mb-1">
                  {msg.senderUID === userData.uid ? "You" : msg.senderName}
                </div>
                <div className="text-gray-900">{msg.text}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {msg.timestamp?.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) || "..."}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex p-3 bg-white border-t border-gray-300 gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
