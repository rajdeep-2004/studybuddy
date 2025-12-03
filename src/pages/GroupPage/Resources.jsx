
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useUserData } from "../../context/UserDataContext.jsx";
import { getRandomColorCombo } from "../../utils/ColourCombos.jsx";

export default function Resources() {
  const { groupID } = useParams();
  const { userData } = useUserData();

  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get(`/resources/${groupID}`);
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };

    fetchResources();
  }, [groupID]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", groupID);
    formData.append("title", file.name); // Using filename as title for now

    try {
      const res = await api.post("/resources/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Manually add to state with populated user
      const newResource = {
          ...res.data,
          fileName: res.data.title, // Backend uses title, frontend uses fileName. 
          // Wait, backend stores 'title' and 'link'. Frontend expects 'fileName' and 'fileURL'.
          // I should map them or update frontend.
          // Let's map them here for compatibility.
          // Actually, let's update the frontend render logic to use title/link if available.
          // But for now, let's map.
          // Backend: title, link, type, createdBy (ID)
          // Frontend expects: fileName, fileURL, fileType, uploadedBy (name)
          // I need to fetch the user name or use userData.
          createdBy: { _id: userData.uid, name: userData.name }
      };
      
      // Re-fetch is safer to get consistent data structure if backend returns different field names
      // But let's try to map.
      // Backend response: { _id, title, link, type, createdBy: "ID", ... }
      // Frontend needs: id, fileName, fileURL, fileType, uploadedBy
      
      // I will update the render logic to handle both or map it.
      // Let's just re-fetch for simplicity? No, that's slow.
      // Let's update the state.
      
      setResources(prev => [...prev, {
          _id: res.data._id,
          fileName: res.data.title,
          fileURL: res.data.link,
          fileType: res.data.title.split('.').pop(),
          uploadedBy: userData.name,
          uploadedByUID: userData.uid,
          createdBy: { _id: userData.uid, name: userData.name } // For new logic
      }]);

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
      await api.delete(`/resources/${resourceID}`);
      setResources((prev) => prev.filter((r) => r._id !== resourceID));
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
                key={res._id}
                className={`${bg}  ${border} p-4 rounded-lg shadow hover:shadow-md transition`}
              >
                <div className="mb-2">
                  <img src={getFileIcon(res.fileType || res.title?.split('.').pop())} className="h-5"></img>
                </div>
                <h4 className="font-semibold text-md break-words">
                  {(res.fileName || res.title).replace(/\.[^/.]+$/, "")}
                </h4>
                <a
                  href={res.fileURL || res.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[rgb(73,156,220)]"
                  download={res.fileName || res.title}
                >
                  View
                </a>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded by:{" "}
                    <span className="font-bold">
                      {" "}
                        {res.createdBy?._id === userData.uid
                        ? "You"
                        : res.createdBy?.name || res.uploadedBy}
                    </span>
                  </p>
                  {res.createdBy?._id === userData.uid ? (
                    <button
                      className="bg-red-300 px-2 text-sm rounded-lg"
                      onClick={() => handleDeleteResource(res._id)}
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
