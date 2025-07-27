import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router";
import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <>

      <Navbar />



      <section>
        <div className="flex justify-between banner">
          <div className="flex flex-col justify-center left">
            <h2 className="text-9xl ml-10 content">
              Study. Smarter. Together.
            </h2>
            <div className="flex lp-cta">
              <Link to="/signup">
                <button className="px-4 py-2 rounded-lg text-white font-semibold w-50 ml-15 mt-20 bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition">
                  Get Started
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-2 rounded-lg text-gray-700 font-semibold w-50 ml-15 mt-20  border-2 hidden border-gray-300 hover:bg-gray-100 transition  login-cta">
                  Login
                </button>
              </Link>
            </div>
          </div>

          <img
            className="h-220 w-250 mr-0 banner-image"
            src="/StudyGroup.jpg"
            alt="Banner"
            
          />
        </div>
      </section>
    </>
  );
}

export default LandingPage;
