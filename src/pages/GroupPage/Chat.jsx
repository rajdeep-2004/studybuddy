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
      const chatList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
        senderAvatar: userData.avatar,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      alert("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Group Chat</h2>

      <div className="flex flex-col flex-grow bg-gray-100 rounded-lg shadow overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => {
            const isOwn = msg.senderUID === userData.uid;

            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {isOwn ? (
                  <>
                    <div
                      className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words bg-green-200 text-right rounded-br-none`}
                    >
                      <div className="font-semibold text-gray-700 mb-1">
                        You
                      </div>
                      <div className="text-gray-900">{msg.text}</div>
                      <div className="text-[10px]  text-gray-500 mt-1 text-right">
                        {msg.timestamp?.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) || "..."}
                      </div>
                    </div>

                    <img
                      src={msg.senderAvatar}
                      alt="avatar"
                      className="h-8 w-8 rounded-full"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={msg.senderAvatar}
                      alt="avatar"
                      className="h-8 w-8 rounded-full"
                    />

                    <div
                      className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words bg-white text-left rounded-bl-none`}
                    >
                      <div className="font-semibold text-gray-700 mb-1">
                        {msg.senderName}
                      </div>
                      <div className="text-gray-900">{msg.text}</div>
                      <div className="text-[10px] text-right text-gray-500 mt-1">
                        {msg.timestamp?.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) || "..."}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="flex p-3 bg-white border-t border-gray-300 gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
