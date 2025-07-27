import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase.jsx";
import { useUserData } from "../../context/UserDataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getRandomColorCombo } from "../../utils/ColourCombos.jsx";

export default function Resources() {
  const { groupID } = useParams();
  const { userData } = useUserData();
  const { currentUser } = useAuth();

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
      const resList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resList);
    });

    return () => unsubscribe();
  }, [groupID]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setUploading(true);

    const fileRef = ref(
      storage,
      `studybuddy/groups/${groupID}/resources/${file.name}`
    );
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
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        resourcesShared: userData.resourcesShared + 1,
      });

      setFile(null);
      setShowForm(false);
    } catch (err) {
      alert("Error uploading file:", err);
      alert("Upload failed");
    }

    setUploading(false);
  };

  const getFileIcon = (type) => {
    if (["png", "jpg", "jpeg"].includes(type)) return `/image.png`;
    if (["pdf"].includes(type)) return `/pdf.png`;
    if (["docx", "doc"].includes(type)) return `/docs.png`;
    if (["xlsx", "csv"].includes(type)) return `/image.png`;
    return `/file.png`;
  };

  const handleDeleteResource = async (resourceID) => {
    try {
      const confirmDelete = confirm("Are you sure?");
      if (!confirmDelete) return;
      await deleteDoc(doc(db, `groups/${groupID}/resources/${resourceID}`));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Group Resources</h2>

      {resources.length === 0 ? (
        <div className="text-gray-500 italic bg-white p-6 rounded-lg shadow">
          No resources uploaded yet. Upload one?
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-4">
          {resources.map((res) => {
            const { bg, border } = getRandomColorCombo();

            return (
              <div
                key={res.id}
                className={`${bg}  ${border} p-4 rounded-lg shadow hover:shadow-md transition`}
              >
                <div className="mb-2">
                  <img src={getFileIcon(res.fileType)} className="h-5"></img>
                </div>
                <h4 className="font-semibold text-md break-words">
                  {res.fileName.replace(/\.[^/.]+$/, "")}
                </h4>
                <a
                  href={res.fileURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[rgb(73,156,220)]"
                  download={res.fileName}
                >
                  View
                </a>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded by:{" "}
                    <span className="font-bold">
                      {" "}
                      {res.uploadedBy === userData.name
                        ? "You"
                        : res.uploadedBy}
                    </span>
                  </p>
                  {res.uploadedBy === userData.name ? (
                    <button
                      className="bg-red-300 px-2 text-sm rounded-lg"
                      onClick={() => handleDeleteResource(res.id)}
                    >
                      Delete
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
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
