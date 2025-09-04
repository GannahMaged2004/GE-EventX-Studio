// Event Details
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react"; // Spinner was already working for you
import { getEvent, createBooking, getEventAvailability } from "../../api/api";

const SEATS_PER_ROW = 10;

// Build labels A1..A10, B1.. etc based on capacity
function buildSeatLabels(capacity) {
  const labels = [];
  for (let i = 0; i < capacity; i++) {
    const rowLetter = String.fromCharCode(65 + Math.floor(i / SEATS_PER_ROW));
    const col = (i % SEATS_PER_ROW) + 1;
    labels.push(`${rowLetter}${col}`);
  }
  return labels;
}

// Payment modal no actual payment 
function PaymentModal({ open, onClose, amount, eventTitle, onSuccess }) {
  const [form, setForm] = useState({ name: "", card: "", exp: "", cvc: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const pay = async () => {
    setError("");
    const { name, card, exp, cvc } = form;
    if (
      !name ||
      card.replace(/\s/g, "").length < 12 ||
      !/^\d{2}\/\d{2}$/.test(exp) ||
      cvc.replace(/\D/g, "").length < 3
    ) {
      setError("Please enter valid payment details.");
      return;
    }
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200)); 
      onSuccess({ id: "PMT_" + Date.now() });
    } catch {
      setError("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };
// Payment modal render
  return (
    <div className="fixed inset-0 z-50">
     
      <div className="absolute inset-0 bg-black/40" onClick={processing ? undefined : onClose} />
     
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
          <div className="px-5 py-4 border-b">
            <h3 className="text-lg font-semibold">Checkout</h3>
          </div>
          <div className="px-5 py-4 space-y-3">
            <p className="text-sm text-gray-600">
              You’re paying <b>{amount}</b> for <b>{eventTitle}</b>.
            </p>

            <div>
              <label className="block text-sm text-gray-700">Name on card</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Card number</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
                value={form.card}
                onChange={(e) => setForm({ ...form, card: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">Expiry (MM/YY)</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="12/27"
                  value={form.exp}
                  onChange={(e) => setForm({ ...form, exp: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">CVC</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="123"
                  inputMode="numeric"
                  value={form.cvc}
                  onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="px-5 py-4 border-t flex items-center justify-end gap-2">
            <button
              className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
              onClick={pay}
              disabled={processing}
            >
              {processing ? "Processing…" : `Pay ${amount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Event Details function does the following:
// - Loads event and availability data
// - Builds seat labels based on capacity
// - Renders seat buttons with appropriate classes based on availability and selected state
// - Renders payment modal with payment form and success/error handling
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [availability, setAvailability] = useState({
    capacity: 0,
    availableSeats: 0,
    taken: [],
  });
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // payment modal toggle
  const [payOpen, setPayOpen] = useState(false);

  const isPast = useMemo(() => {
    if (!event?.date) return false;
    return new Date(event.date).getTime() < Date.now();
  }, [event]);

  const load = async () => {
    try {
      setLoading(true);
      const [e, a] = await Promise.all([getEvent(id), getEventAvailability(id)]);
      setEvent(e);
      setAvailability(
        a || {
          capacity: e?.capacity ?? 0,
          availableSeats: e?.availableSeats ?? 0,
          taken: [],
        }
      );
    } catch (e) {
      setErr(e.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const seats = useMemo(
    () => buildSeatLabels(availability.capacity || event?.capacity || 0),
    [availability.capacity, event]
  );
  const takenSet = useMemo(() => new Set(availability.taken || []), [availability.taken]);

  const soldOut = (availability.availableSeats ?? 0) <= 0;

  const onSelect = (label) => {
    if (takenSet.has(label) || isPast || soldOut) return;
    setSelected((prev) => (prev === label ? "" : label));
  };

  const startCheckout = () => {
    if (isPast) return alert("This event date has passed.");
    if (soldOut) return alert("No available seats.");
    if (!selected) return alert("Please select a seat.");
    setPayOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setPayOpen(false);
    try {
      await createBooking(id, { seatNum: selected });
      navigate("/user/tickets");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Booking failed");
      load(); 
    }
  };

  if (loading)
    return (
      <div className="p-6 grid place-items-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-gray-700">
          <Spinner aria-label="Loading event" />
          <span>Loading…</span>
        </div>
      </div>
    );
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!event) return <div className="p-6">Event not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="mt-1 text-gray-600">{event.description}</p>
        <div className="mt-2 text-sm text-gray-500">
          {event.venue || "—"} • {event.date ? new Date(event.date).toLocaleString() : "No date"}
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Price: {event.price} • Capacity: {event.capacity} • Available:{" "}
          {availability.availableSeats ?? event.availableSeats}
        </div>
        {(isPast || soldOut) && (
          <div
            className={`mt-3 inline-block rounded-lg px-3 py-1 text-sm ${
              isPast ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {isPast ? "Event date has passed" : "Sold out"}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow p-4">
        <h2 className="font-semibold mb-3">Choose your seat</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded border bg-white inline-block" /> Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-gray-300 inline-block" /> Taken
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-indigo-600 inline-block" /> Selected
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="inline-block">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${SEATS_PER_ROW}, minmax(40px, 1fr))`,
                gap: "8px",
              }}
            >
              {seats.map((label) => {
                const taken = takenSet.has(label);
                const selectedCls = selected === label ? "bg-indigo-600 text-white" : "";
                const baseCls = taken
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-indigo-50 cursor-pointer";
                return (
                  <button
                    key={label}
                    disabled={taken || isPast || soldOut}
                    onClick={() => onSelect(label)}
                    className={`h-10 rounded-lg border text-sm font-medium ${selectedCls || baseCls}`}
                    title={taken ? `${label} (taken)` : label}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            disabled={!selected || isPast || soldOut}
            onClick={startCheckout}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
          >
            {selected ? `Checkout for ${selected}` : "Select a seat"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={String(event.price)}
        eventTitle={event.title}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
