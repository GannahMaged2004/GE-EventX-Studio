import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getAllBookings, getEvents } from "../../api/api";
import { downloadBlob } from "../../utils/downloadBlob";
import { Spinner } from "flowbite-react";
export default function Tickets() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filters (server param: eventId; others are client-side)
  const [eventId, setEventId] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState(""); // YYYY-MM-DD
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("dateDesc"); // default: newest first

  const fetchEvents = async () => {
    try {
      const list = await getEvents();
      setEvents(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErr("");
      const params = {};
      if (eventId) params.eventId = eventId;
      const list = await getAllBookings(params);
      setBookings(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => { fetchBookings(); }, [eventId]);

  // client-side filter + sort
  const filtered = useMemo(() => {
    let rows = [...bookings];

    // q matches event title, user name/email, seat
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter(b => {
        const t = [
          b.event?.title,
          b.user?.name,
          b.user?.email,
          b.seatNum,
          String(b.price)
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return t.includes(needle);
      });
    }

    // date range on createdAt
    if (from) {
      const fromTs = new Date(from + "T00:00:00").getTime();
      rows = rows.filter(b => new Date(b.createdAt).getTime() >= fromTs);
    }
    if (to) {
      const toTs = new Date(to + "T23:59:59").getTime();
      rows = rows.filter(b => new Date(b.createdAt).getTime() <= toTs);
    }

    // sort
    switch (sort) {
      case "dateAsc":
        rows.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)); break;
      case "dateDesc":
        rows.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "priceAsc":
        rows.sort((a,b)=> (a.price??0) - (b.price??0)); break;
      case "priceDesc":
        rows.sort((a,b)=> (b.price??0) - (a.price??0)); break;
      default: break;
    }

    return rows;
  }, [bookings, q, from, to, sort]);

  const resetFilters = () => {
    setEventId(""); setQ(""); setFrom(""); setTo(""); setSort("dateDesc");
  };

  const exportCSV = () => {
    const headers = [
      "BookingID","Event","UserName","UserEmail","Seat","Price","Status","CreatedAt"
    ];
    const lines = filtered.map(b => [
      b._id,
      b.event?.title || "",
      b.user?.name || "",
      b.user?.email || "",
      b.seatNum || "",
      b.price ?? "",
      b.status || "",
      b.createdAt ? new Date(b.createdAt).toLocaleString() : ""
    ].map(v => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(","));

    const csv = [headers.join(","), ...lines].join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "bookings.csv");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <div className="flex gap-2">
            <button onClick={fetchBookings} className="px-3 py-2 rounded-xl border hover:bg-gray-50">Refresh</button>
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Export CSV</button>
          </div>
        </div>

        {/* filters */}
        <div className="rounded-2xl bg-white p-4 shadow">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Search</label>
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Name, email, event, seat…"
                className="w-full p-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Event</label>
              <select
                value={eventId}
                onChange={(e)=>setEventId(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="">All events</option>
                {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="w-full p-3 rounded-xl border" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="w-full p-3 rounded-xl border" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select value={sort} onChange={(e)=>setSort(e.target.value)} className="p-2 rounded-lg border">
                <option value="dateDesc">Date ↓</option>
                <option value="dateAsc">Date ↑</option>
                <option value="priceDesc">Price ↓</option>
                <option value="priceAsc">Price ↑</option>
              </select>
            </div>
            <button onClick={resetFilters} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Clear</button>
            <span className="ml-auto text-sm text-gray-600">
              Showing <b>{filtered.length}</b> of <b>{bookings.length}</b>
            </span>
          </div>
        </div>

        {/* table */}
        <div className="rounded-2xl bg-white p-4 shadow overflow-x-auto">
          {loading ? (
            <div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div>
          ) : err ? (
            <div className="text-red-600">{err}</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500">No bookings found.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Booking ID</th>
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Buyer</th>
                  <th className="py-2 pr-4">Seat</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">QR</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{b._id}</td>
                    <td className="py-2 pr-4">{b.event?.title || "-"}</td>
                    <td className="py-2 pr-4">
                      <div className="font-medium">{b.user?.name || "-"}</div>
                      <div className="text-gray-500">{b.user?.email || ""}</div>
                    </td>
                    <td className="py-2 pr-4">{b.seatNum || "-"}</td>
                    <td className="py-2 pr-4">{b.price ?? "-"}</td>
                    <td className="py-2 pr-4 capitalize">{b.status || "-"}</td>
                    <td className="py-2 pr-4">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                    <td className="py-2 pr-4">
                      {b.qrCode || b.qrCodeImage ? (
                        <img src={b.qrCode || b.qrCodeImage} alt="QR" className="h-10 w-10 object-contain border rounded" />
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
