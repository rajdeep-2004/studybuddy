import React, { useState } from "react";
import { db } from "../firebase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import Navbar from "../components/Navbar.jsx";

const SignUpPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [create, setCreate] = useState(false);

  function handleSignup() {
    setCreate(true);
    signup(email, password)
      .then(async (userCredentials) => {
        await setDoc(doc(db, "users", userCredentials.user.uid), {
          uid: userCredentials.user.uid,
          name: name,
          email: email,
          joinedGroups: [],
          resourcesShared: 0,
          sessionsCreated: 0,
          totalTodos: 0,
          completedTodos: 0
        });
        setCreate(false); 
        navigate("/dashboard");
      })
      .catch((error) => {
        alert(error.message);
        setCreate(false); 
      });
  }

  return (
    <>
      {/* Navbar */}
      <Navbar
        links={
          <div className="flex items-center space-x-6">
            <a href="/" className="text-black hover:text-[rgb(109,191,254)]">
              Home
            </a>
            <a href="/" className="text-black hover:text-[rgb(109,191,254)]">
              Contacts
            </a>
            <Link to="/login">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Log In
              </button>
            </Link>
          </div>
        }
      />

      {/* Sign Up Section */}
      <section>
        <div className="flex justify-between">
          {/* Left side Image */}
          <img
            className="h-232 w-250 mr-0"
            src="src/assets/signup.jpg"
            alt="SignUpImage"
          />

          {/* Right side form */}

          <div className="w-1/2 flex items-center justify-center bg-white p-12">
            <div className="w-full max-w-xl">
              <h1 className="text-4xl font-bold text-[rgb(109,191,254)] mb-3">
                Student Sign Up
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Hey enter your details to create your account
              </p>

              <input
                type="text"
                placeholder="Enter your name"
                className="mb-5 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Enter your email address"
                className="mb-5 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter your password"
                className="mb-7 px-5 py-4 w-full border rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-[rgb(109,191,254)] hover:bg-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="w-full bg-[rgb(173,216,255)] border-2 border-[rgb(173,216,255)] text-white font-semibold text-lg py-4 rounded-xl transition hover:text-black hover:bg-white"
                onClick={handleSignup}
              >
                {create ? "Creating..." : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUpPage;
