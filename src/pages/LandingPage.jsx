import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router";

function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Banner and CTA */}

      <section className="Banner">
        <div className="flex justify-between">
          <div className="flex flex-col justify-center">
            <h2 className="text-9xl ml-10">Study. Smarter. Together.</h2>
            <Link to="/signup">
              <button className="px-4 py-2 rounded-lg text-white font-semibold w-50 ml-15 mt-20 bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] hover:bg-white hover:text-black transition">
                Get Started
              </button>
            </Link>
          </div>

          <img
            className="h-220 w-250 mr-0"
            src="/StudyGroup.jpg"
            alt="Banner"
          />
        </div>
      </section>
    </>
  );
}

export default LandingPage;
