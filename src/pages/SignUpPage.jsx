import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles/SignUpPage.css";
import { registerUser } from "../api";
import Dashboard from "./Dashboard.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !gender) {
      alert("Please fill all the fields including gender.");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, gender });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section>
        <div className="flex justify-between signup">
          <img className="h-232 w-250 mr-0 signup-img" src="/signup.jpg" alt="SignUpImage" />
          <div className="w-1/2 flex items-center justify-center bg-white p-12 signup-form">
            <div className="w-full max-w-xl ">
              <h1 className="text-4xl font-bold text-[rgb(109,191,254)] mb-3">Student Sign Up</h1>
              <p className="text-gray-600 text-lg mb-8">Hey enter your details to create your account</p>

              <input type="text" placeholder="Enter your name" className="mb-5 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200" value={name} onChange={(e) => setName(e.target.value)} />

              <input type="email" placeholder="Enter your email address" className="mb-5 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200" value={email} onChange={(e) => setEmail(e.target.value)} />

              <input type="password" placeholder="Enter your password" className="mb-7 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200" value={password} onChange={(e) => setPassword(e.target.value)} />

              <div className="flex items-center gap-10 mb-7">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="gender" value="male" className="w-5 h-5 cursor-pointer" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} />
                  <span className="text-lg text-gray-700">Male</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="gender" value="female" className="w-5 h-5 cursor-pointer" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} />
                  <span className="text-lg text-gray-700">Female</span>
                </label>
              </div>

              <button className="w-full bg-[rgb(173,216,255)] border-2 border-[rgb(173,216,255)] text-white font-semibold text-lg py-4 rounded-xl transition hover:text-black hover:bg-white" onClick={handleSignup}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
