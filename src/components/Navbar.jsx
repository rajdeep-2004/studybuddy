import "../index.css";

function Navbar({links}) {
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
            {links}
        </nav>
    );
}

export default Navbar;
