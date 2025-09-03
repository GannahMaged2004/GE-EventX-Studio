import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvent, createBooking } from "../../api/api";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [seat, setSeat] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { (async () => {
    const { data } = await getEvent(id);
    setEvent(data);
  })(); }, [id]);

  const book = async () => {
    try {
      await createBooking(id, { seatNum: seat });
      setMsg("Booking confirmed!");
    } catch (e) {
      setMsg(e.response?.data?.message || "Booking failed");
    }
  };

  if (!event) return null;
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p><b>Date:</b> {new Date(event.date).toLocaleString()}</p>
          <p><b>Venue:</b> {event.venue}</p>
          <p><b>Price:</b> {event.price} LKR</p>
          <p><b>Available:</b> {event.availableSeats}</p>
          <div className="mt-3 flex gap-2">
            <input className="border rounded px-3 py-2" placeholder="Seat (e.g., A12)" value={seat} onChange={e=>setSeat(e.target.value)} />
            <button className="btn gradient-btn text-white px-4 py-2 rounded" onClick={book}>Book</button>
          </div>
          {msg && <p className="mt-2">{msg}</p>}
        </div>
        <div className="grid grid-cols-10 gap-1 bg-white rounded p-3">
          {Array.from({length:100}).map((_,i)=>
            <div key={i} className="w-5 h-5 border rounded-sm bg-gray-50" />
          )}
        </div>
      </div>
    </div>
  );
}
