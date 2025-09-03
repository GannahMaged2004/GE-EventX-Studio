import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/api";

export default function MyTickets() {
  const [items, setItems] = useState([]);

  useEffect(() => { (async () => {
    const { data } = await getMyBookings();
    setItems(data);
  })(); }, []);

  return (
    <div className="p-6 grid md:grid-cols-2 gap-4">
      {items.map(b => (
        <div key={b._id} className="p-4 rounded-xl shadow bg-white">
          <h3 className="font-semibold">{b.event?.title}</h3>
          <p className="text-sm text-gray-600">{new Date(b.createdAt).toLocaleString()}</p>
          <p>Seat: {b.seatNum} — {b.price} LKR</p>
          {b.qrCode && <img className="mt-3 w-40" src={b.qrCode} alt="QR code" />}
        </div>
      ))}
      {!items.length && <p>No tickets yet.</p>}
    </div>
  );
}
