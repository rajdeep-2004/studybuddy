import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";

export default function Resources() {
  const { groupID } = useParams();
  const { userData } = useUserData();

  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "groups", groupID, "resources"),
      orderBy("uploadedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResources(resList);
    });

    return () => unsubscribe();
  }, [groupID]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setUploading(true);

    const fileRef = ref(storage, `studybuddy/groups/${groupID}/resources/${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      const fileType = file.name.split(".").pop();

      await addDoc(collection(db, "groups", groupID, "resources"), {
        fileName: file.name,
        fileType,
        fileURL: url,
        uploadedBy: userData.name,
        uploadedByUID: userData.uid,
        uploadedAt: serverTimestamp(),
      });

      setFile(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed");
    }

    setUploading(false);
  };

  const getFileIcon = (type) => {
    if (["png", "jpg", "jpeg"].includes(type)) return "🖼️";
    if (["pdf"].includes(type)) return "📄";
    if (["docx", "doc"].includes(type)) return "📝";
    if (["xlsx", "csv"].includes(type)) return "📊";
    return "📁";
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">📚 Group Resources</h2>

      {resources.length === 0 ? (
        <div className="text-gray-500 italic bg-white p-6 rounded-lg shadow">
          No resources uploaded yet. Upload one?
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-4">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-2">{getFileIcon(res.fileType)}</div>
              <h4 className="font-semibold text-md break-words">
                {res.fileName}
              </h4>
              <a
                href={res.fileURL}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm hover:underline break-all"
                download={res.fileName}
              >
                Download
              </a>
              <p className="text-sm text-gray-500 mt-1">
                Uploaded by: {res.uploadedBy === userData.name ? "You" : res.uploadedBy}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {!showForm && (
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 rounded-lg text-white bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition"
          >
            Upload Resource
          </button>
        </div>
      )}

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h3 className="text-lg font-semibold mb-4">Upload New Resource</h3>

          <div className="space-y-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="p-2 rounded-lg text-white bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Save Resource"}
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
