import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Firebase/AuthProvider";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <nav className="bg-parrot-green-50/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
      <div className="w-11/12 mx-auto">
        <div className="flex justify-between items-center py-3.5">
          {/* Left: Brand Name */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors">
              Warranty Wallet
            </span>
          </Link>
          
          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white/90 hover:bg-white text-gray-700 hover:text-primary px-4 py-2 rounded-lg transition-colors font-medium border border-gray-200 shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/registration"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

