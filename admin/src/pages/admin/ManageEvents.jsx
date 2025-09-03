import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getEvents, createEvent, deleteEvent } from "../../api/api";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", date:"", venue:"", price:0, capacity:100, popularity:"high", tags:[] });

  const load = async () => {
    const { data } = await getEvents();
    setEvents(data);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await createEvent(form);
    setForm({ title:"", description:"", date:"", venue:"", price:0, capacity:100, popularity:"high", tags:[] });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex gap-5 p-6">
      <Sidebar />
      <main className="space-y-6 flex-1">
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-3">Create Event</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Venue" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}/>
            <input className="border rounded px-3 py-2" type="datetime-local" onChange={e=>setForm({...form,date:e.target.value})}/>
            <input className="border rounded px-3 py-2" type="number" placeholder="Price" onChange={e=>setForm({...form,price:+e.target.value})}/>
            <input className="border rounded px-3 py-2" type="number" placeholder="Capacity" onChange={e=>setForm({...form,capacity:+e.target.value})}/>
          </div>
          <textarea className="border rounded px-3 py-2 w-full mt-3" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <button className="btn gradient-btn text-white px-4 py-2 rounded mt-3" onClick={create}>Save</button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(ev => (
            <div key={ev._id} className="p-4 bg-white rounded-xl shadow">
              <div className="font-semibold">{ev.title}</div>
              <div className="text-sm text-gray-500">{new Date(ev.date).toLocaleString()}</div>
              <div className="text-sm">{ev.venue}</div>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 rounded border">Edit</button>
                <button className="px-3 py-1 rounded border text-red-600" onClick={()=>deleteEvent(ev._id).then(load)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
