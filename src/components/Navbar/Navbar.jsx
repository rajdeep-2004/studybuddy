import "../../index.css";

function Navbar() {
    return (
        <nav className="sticky top-0 z-10 backdrop-blur-lg bg-opacity-10 border-b border-gray-200 flex items-center justify-between px-10 py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <img 
                    src="src/assets/logo.png" 
                    alt="Study Buddy Logo" 
                    className="h-8 w-auto" 
                />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
                <a href="#" className="text-black hover:text-[rgb(109,191,254)]">Home</a>
                <a href="#" className="text-black hover:text-[rgb(109,191,254)]">Features</a>
                <a href="#" className="text-black hover:text-[rgb(109,191,254)]">Contact</a>
                
                {/* CTA Buttons */}
                <button className="bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] text-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition">
                    Get Started Free
                </button>
                <button className="border border-gray-300 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 transition">
                    Log In
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
