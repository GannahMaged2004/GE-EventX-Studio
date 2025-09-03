import { useEffect, useState } from "react";
import { getEvents } from "../../api/api";
import EventCard from "../../components/EventCard";

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await getEvents(search ? { search } : undefined);
    setEvents(data);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <input className="border rounded px-3 py-2" placeholder="Search events..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <button className="btn gradient-btn text-white px-4 py-2 rounded" onClick={load}>Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map(ev => (
          <EventCard key={ev._id} event={{
            title: ev.title,
            price: ev.price + " LKR",
            sold: Math.max(0, (ev.capacity ?? 0) - (ev.availableSeats ?? 0)),
            available: ev.availableSeats ?? 0,
            venue: ev.venue, date: new Date(ev.date).toLocaleDateString(),
            time: new Date(ev.date).toLocaleTimeString(),
            icon: "🎫", status: "upcoming",
          }}/>
        ))}
      </div>
    </div>
  );
}
