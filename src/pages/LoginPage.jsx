import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signin, setSignin] = useState(false);

  function handleLogin() {
        setSignin(true);
    login(email, password)
      .then(() => {
        navigate("/dashboard");
        setSignin(false);
      })
      .catch((error) => {
        alert(error.message);
        setSignin(false);
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
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition">
              Log In
            </button>
          </div>
        }
      />

      {/* Login Section */}
      <section>
        <div className="flex justify-between">
          {/* Left side Image */}
          <img
            className="h-232 w-250 mr-0"
            src="/signup.jpg"
            alt="LoginImage"
          />

          {/* Right side form */}
          <div className="w-1/2 flex items-center justify-center bg-white p-12">
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
                onClick={handleLogin}
              >
               {signin ? "Signing In..." : "Log In"} 
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
