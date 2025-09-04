// MyTickets
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getUserBookings } from "../../api/api";
import { Spinner } from "flowbite-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// this component is used to display the user's bookings
// it fetches the user's bookings from the API and displays them in a list
// it also includes a QR code for each booking and a button to download it
export default function MyTickets() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paid = searchParams.get("paid") === "1";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const b = await getUserBookings();
      setList(Array.isArray(b) ? b : []);
    } catch (e) {
      setErr(e.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // After successful payment, poll briefly so the webhook can create the booking
  useEffect(() => {
    if (!paid) return;
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      await load();
      if (tries >= 6) clearInterval(timer); // ~6s max
    }, 1000);
    return () => clearInterval(timer);
  }, [paid]);

  // Download QR
  const downloadQR = async (src, filename = "ticket-qr.png") => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Could not download QR");
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid place-items-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-gray-700">
          <Spinner aria-label="Loading tickets" />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return (
    
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />

      <h1 className="text-2xl font-bold text-white mb-4 text-center pt-5">My Tickets</h1>

      <div className="grid gap-4">
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="text-gray-700 font-medium mb-2">You have no bookings yet.</div>
            <Link
              to="/user/browse"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Book Now
            </Link>
          </div>
        ) : (
          list.map((b) => {
            const qr = b.qrCodeImage || b.qrCode; // tolerate backend field name
            const eventTitle = b.event?.title || "-";
            const when = b.event?.date ? new Date(b.event.date).toLocaleString() : "";
            return (
              <div key={b._id} className="rounded-2xl border bg-white p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-lg truncate">{eventTitle}</div>
                  {when && <div className="text-xs text-gray-500">{when}</div>}
                  <div className="mt-1 text-sm text-indigo-900">
                    Seat: {b.seatNum} • Price: {b.price} •{" "}
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/user/events/${b.event?._id || ""}`)}
                      className="px-3 py-1.5 rounded-lg border hover:bg-blue-400 hover:text-white"
                    >
                      View Event
                    </button>
                    {qr && (
                      <button
                        onClick={() => downloadQR(qr, `qr-${b._id}.png`)}
                        className="px-3 py-1.5 rounded-lg border hover:bg-green-400 hover:text-white"
                      >
                        Download QR
                      </button>
                    )}
                  </div>
                </div>

                {qr ? (
                  <img
                    src={qr}
                    alt="QR Code"
                    className="w-24 h-24 object-contain border rounded-lg shrink-0"
                  />
                ) : (
                  <div className="text-xs text-red-600">No QR</div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/user/browse")}
          className="border font-semibold py-2 px-4 rounded-xl hover:bg-gray-300 bg-white"
        >
          Browse Events
        </button>
      </div>
      <div className="bg-gray-900">
        <Footer />
      </div>
    </div>
  );
}
