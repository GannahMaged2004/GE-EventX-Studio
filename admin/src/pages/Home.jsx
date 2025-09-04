// Home Page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <section className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex flex-col justify-center items-center text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">Discover & Manage Events Easily</h1>
        <p className="text-lg max-w-2xl mb-6">
          Join EventXStudio to browse upcoming events, manage your tickets, or
          host your own amazing event.
        </p>
        <div className="space-x-4">
            <Link
            to="/auth/login"
            className="bg-green-200 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-400 transition"
          >
            Welcome Back
          </Link>
          <Link
            to="/user/browse"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
          >
            Browse Events
          </Link>
          <Link
            to="/auth/register"
            className="bg-yellow-200 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition"
          >
            Get Started 
          </Link>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose EventXStudio?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Easy Ticketing</h3>
            <p>Purchase, track, and manage your tickets in one place.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">For Organizers</h3>
            <p>Create, promote, and analyze your events with powerful tools.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p>Connect with attendees, discover new events, and share moments.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
