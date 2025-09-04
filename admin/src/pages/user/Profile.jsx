//Profile
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/api";
import { Spinner } from "flowbite-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// This is the code for the Profile page
// It uses the useAuth and api functions from the context and api files respectively
export default function Profile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const profile = await getProfile(); // returns the user object
        setMe(profile);
      } catch (e) {
        setErr(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-white"><div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div></div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;
  if (!me) return null;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Navbar />
      <div className="mt-6 mb-10 text-center"></div>
      <div className="rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">My Profile</h1>

        <div className="grid grid-cols-1 gap-3 text-gray-800">
          <div><b>Name:</b> {me.name}</div>
          <div><b>Email:</b> {me.email}</div>
          <div><b>Role:</b> {me.role}</div>
          {typeof me.age !== "undefined" && <div><b>Age:</b> {me.age}</div>}
          {me.gender && <div><b>Gender:</b> {me.gender}</div>}
          {me.location && <div><b>Location:</b> {me.location}</div>}
          {Array.isArray(me.interests) && me.interests.length > 0 && (
            <div><b>Interests:</b> {me.interests.join(", ")}</div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/user/browse")}
            className="border font-semibold py-2 px-4 rounded-xl hover:bg-gray-50"
          >
            Browse Events
          </button>
        </div>
      </div>
      <div className="bg-gray-900">
        <Footer />
      </div>
    </div>
  );
}
