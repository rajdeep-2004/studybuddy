import React, { useState } from "react";
import { db, storage } from "../firebase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Navbar.jsx";

const SignUpPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [create, setCreate] = useState(false);
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !gender) {
      alert("Please fill all the fields including gender.");
      return;
    }

    setCreate(true);
    try {
      const userCredentials = await signup(email, password);
      const uid = userCredentials.user.uid;

      // Step 1: Fetch avatar from API as blob
      const avatarURL =
        gender === "male"
          ? "https://avatar.iran.liara.run/public/boy"
          : "https://avatar.iran.liara.run/public/girl";

      const response = await fetch(avatarURL);
      const blob = await response.blob();

      // Step 2: Upload avatar to Firebase Storage
      const fileRef = ref(
        storage,
        `studybuddy/users/avatars/${uid}/${name}.png`
      );
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      // Step 3: Store user data with avatar URL in Firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        joinedGroups: [],
        resourcesShared: 0,
        sessionsCreated: 0,
        totalTodos: 0,
        completedTodos: 0,
        avatar: downloadURL,
      });

      setCreate(false);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
      console.error("Signup error:", error);
      setCreate(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Sign Up Section */}
      <section>
        <div className="flex justify-between">
          {/* Left side Image */}
          <img
            className="h-232 w-250 mr-0"
            src="/signup.jpg"
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

              <div className="flex items-center gap-10 mb-7">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="w-5 h-5 cursor-pointer"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span className="text-lg text-gray-700">Male</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="w-5 h-5 cursor-pointer"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span className="text-lg text-gray-700">Female</span>
                </label>
              </div>

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
