import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase/AuthProvider";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Warranty Wallet
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your product warranties digitally and never miss an expiry date
          </p>
          {!user ? (
            <div className="flex justify-center space-x-4">
              <Link
                to="/registration"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-lg text-gray-700 mb-4">
                Welcome back, {user.displayName || user.email}!
              </p>
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Digital Warranty Management</h3>
            <p className="text-gray-600">
              Store all your warranty information in one secure place
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">
              Get notified before your warranties expire
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Document Storage</h3>
            <p className="text-gray-600">
              Keep your purchase invoices safe and accessible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

