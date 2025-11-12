import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { loginUser } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Login Section */}
      <section>
        <div className="flex justify-between loginpage">
          {/* Left side Image */}
          <img
            className="h-232 w-250 mr-0 signup-img"
            src="/signup.jpg"
            alt="LoginImage"
          />

          {/* Right side form */}
          <div className="w-1/2 flex items-center justify-center bg-white p-12 login-form">
            <div className="w-full max-w-xl">
              <h1 className="text-4xl font-bold text-[rgb(109,191,254)] mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Log in to continue to StudyBuddy
              </p>

              <input
                type="email"
                placeholder="Enter your email address"
                className="mb-5 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg 
                focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter your password"
                className="mb-7 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg 
                focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="w-full bg-[rgb(173,216,255)] border-2 border-[rgb(173,216,255)] 
                text-white font-semibold text-lg py-4 rounded-xl transition 
                hover:text-black hover:bg-white"
                onClick={handleLogin}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
