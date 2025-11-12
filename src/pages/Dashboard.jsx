import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Not logged in");
        return;
      }
      try {
        const res = await fetch("https://study-buddy-v2-backend.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setMessage(data.message);
        else setMessage(data.message || "Unauthorized");
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    };
    fetchData();
  }, []);

  return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-xl font-medium">{message}</div>;
};

export default Dashboard;