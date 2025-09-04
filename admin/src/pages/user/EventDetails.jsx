// EventDetails
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent, createBooking } from "../../api/api";
import { useAuth } from "../../context/useAuth";
import { Spinner } from "flowbite-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


// Payment Modal i didn't really do much here cuz you don't need it in this project cuz you won't actually book
function PaymentModal({ open, amount, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");   // MM/YY
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const valid = name.trim() && /^\d{16}$/.test(card.replace(/\s+/g,'')) && /^\d{2}\/\d{2}$/.test(exp) && /^\d{3,4}$/.test(cvv);

  const pay = async () => {
    if (!valid) return;
    try {
      setProcessing(true);
      // simulate payment delay
      await new Promise(r => setTimeout(r, 900));
      onSuccess?.(); // let parent proceed with booking
    } finally {
      setProcessing(false);
    }
  };

  // this function is used to render the payment modal
  // it uses the useAuth and api functions from the context and api files respectively
  if (!open) return null;
  // Render
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Payment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="text-sm text-gray-600 mb-4">Total due: <b>{amount ?? "-"}</b></div>
        <div className="space-y-3">
          <input className="w-full border rounded-xl p-3" placeholder="Name on card" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border rounded-xl p-3" placeholder="Card number (16 digits)" value={card} onChange={e=>setCard(e.target.value)} maxLength={19}/>
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border rounded-xl p-3" placeholder="MM/YY" value={exp} onChange={e=>setExp(e.target.value)} maxLength={5}/>
            <input className="w-full border rounded-xl p-3" placeholder="CVV" value={cvv} onChange={e=>setCvv(e.target.value)} maxLength={4}/>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border">Cancel</button>
          <button
            onClick={pay}
            disabled={!valid || processing}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
          >
            {processing ? "Processing…" : "Pay & Confirm"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">Demo checkout — no real charge.</p>
      </div>
    </div>
  );
}

// EventDetails
// This is the main component that renders the event details and allows the user to book a seat
// It uses the useAuth and api functions from the context and api files respectively
// It also uses the PaymentModal component to simulate a payment modal
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [seatNum, setSeatNum] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const e = await getEvent(id);
        setEvent(e);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const isPast = useMemo(() => {
    if (!event?.date) return false;
    return new Date(event.date).getTime() < Date.now();
  }, [event]);

  const soldOut = (event?.availableSeats ?? 0) <= 0;

  // precheck function to check if user is authenticated, event is not past, and seat is not empty
  const precheck = () => {
    if (!user) {
      navigate("/auth/login");
      return false;
    }
    if (isPast) {
      alert("This event has already occurred.");
      return false;
    }
    if (soldOut) {
      alert("This event is sold out.");
      return false;
    }
    if (!seatNum.trim()) {
      alert("Please enter a seat identifier (e.g., A12)");
      return false;
    }
    return true;
  };

  // onBookClick function to handle the booking process
  const onBookClick = () => {
    if (!precheck()) return;
    setPayOpen(true); 
  };

  const doBooking = async () => {
    try {
      await createBooking(id, { seatNum: seatNum.trim() });
      setPayOpen(false);
      navigate("/user/tickets");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e.message || "Booking failed");
      setPayOpen(false);
    }
  };


  if (loading) return <div className="p-6"><div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div></div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!event) return <div className="p-6">Event not found.</div>;

  // render 
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 bg-white rounded-xl shadow">
      <div className=" overflow-hidden">
        <Navbar />
      </div>
      {event.imageUrl && (
        <div className="rounded-xl overflow-hidden">
          <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" />
        </div>
      )}

      <h1 className="text-2xl font-bold">{event.title}</h1>

      {(isPast || soldOut) && (
        <div className={`rounded-xl p-3 text-sm ${isPast ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
          {isPast ? "This event has already occurred." : "Sold out — no seats available."}
        </div>
      )}

      <div className="text-gray-600">{event.description}</div>
      <div className="text-sm text-gray-500">
        {event.venue || "—"} • {event.date ? new Date(event.date).toLocaleString() : "No date"}
      </div>
      <div className="text-sm text-gray-600">
        Price: {event.price} • Capacity: {event.capacity} • Available: {event.availableSeats}
        {event.category ? ` • Category: ${event.category}` : ""}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <input
          value={seatNum}
          onChange={(e) => setSeatNum(e.target.value)}
          placeholder="Seat (e.g., A12)"
          className="p-3 rounded-xl border"
          disabled={isPast || soldOut}
        />
        <button
          onClick={onBookClick}
          disabled={isPast || soldOut}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
        >
          Book
        </button>
      </div>

      <PaymentModal
        open={payOpen}
        amount={event.price}
        onClose={() => setPayOpen(false)}
        onSuccess={doBooking}
      />
      <div className="bg-gray-900 rounded">
        <Footer />
      </div>
    </div>
  );
}
