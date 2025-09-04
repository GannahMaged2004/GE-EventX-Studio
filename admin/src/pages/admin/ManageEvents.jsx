import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getEvents, deleteEvent } from "../../api/api";
import { Spinner } from "flowbite-react";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((list) => list.filter((e) => e._id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-white rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Manage Events</h1>
          <button
            onClick={() => navigate("/admin/event-form")}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + Add Event
          </button>
        </div>

        {loading ? (
          <div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div>
        ) : events.length === 0 ? (
          <div className="text-red-500">No events yet.</div>
        ) : (
          <div className="grid gap-4">
            {events.map((e) => (
              <div key={e._id} className="rounded-2xl border p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{e.title}</div>
                  <div className="text-sm text-gray-600">
                    {e.venue || "—"} • {e.date ? new Date(e.date).toLocaleString() : "No date"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Price: {e.price} • Capacity: {e.capacity} • Available: {e.availableSeats}
                  </div>
                  {Array.isArray(e.tags) && e.tags.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">Tags: {e.tags.join(", ")}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-2 rounded-xl border bg-blue-500 text-white"
                    onClick={() => navigate(`/admin/event-form/${e._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    onClick={() => onDelete(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
