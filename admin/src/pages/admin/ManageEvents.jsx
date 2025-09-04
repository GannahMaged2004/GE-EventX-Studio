// src/pages/admin/BookingTickets.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Spinner, Badge, TextInput } from "flowbite-react";
import { LuCalendarDays } from "react-icons/lu";
import {
  getEvents,
  getAllBookings,
  getEventAvailability,
  deleteEvent,
} from "../../api/api";

const SEATS_PER_ROW = 10;

const buildSeatLabels = (capacity) => {
  const out = [];
  for (let i = 0; i < capacity; i++) {
    const row = String.fromCharCode(65 + Math.floor(i / SEATS_PER_ROW)); // A,B,C...
    const col = (i % SEATS_PER_ROW) + 1;
    out.push(`${row}${col}`);
  }
  return out;
};

export default function BookingTickets() {
  const navigate = useNavigate();

  // shared state
  const [tab, setTab] = useState("seating"); // "seating" | "events"
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // seating state
  const [availability, setAvailability] = useState({
    capacity: 0,
    availableSeats: 0,
    taken: [],
  });
  const [selectedSeat, setSelectedSeat] = useState("");
  const [search, setSearch] = useState("");

  const selectedEvent = useMemo(
    () => events.find((e) => e._id === eventId) || null,
    [events, eventId]
  );
  const takenSet = useMemo(
    () => new Set(availability.taken || []),
    [availability.taken]
  );
  const seats = useMemo(
    () => buildSeatLabels(availability.capacity || selectedEvent?.capacity || 0),
    [availability.capacity, selectedEvent]
  );

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = bookings.filter((b) => b?.event?._id === eventId);
    if (!q) return list;
    return list.filter(
      (b) =>
        (b.user?.email || "").toLowerCase().includes(q) ||
        (b.seatNum || "").toLowerCase().includes(q) ||
        (b._id || "").toLowerCase().includes(q)
    );
  }, [bookings, search, eventId]);

  // load lists
  const loadData = async () => {
    setLoading(true);
    try {
      setErr("");
      const [ev, allB] = await Promise.all([getEvents(), getAllBookings()]);
      setEvents(Array.isArray(ev) ? ev : []);
      setBookings(Array.isArray(allB) ? allB : []);
      if (!eventId && ev?.length) setEventId(ev[0]._id);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async (id) => {
    if (!id) return;
    try {
      const a = await getEventAvailability(id);
      setAvailability(
        a || {
          capacity: selectedEvent?.capacity || 0,
          availableSeats: selectedEvent?.availableSeats || 0,
          taken: [],
        }
      );
    } catch {
      setAvailability({
        capacity: selectedEvent?.capacity || 0,
        availableSeats: selectedEvent?.availableSeats || 0,
        taken: [],
      });
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedSeat("");
    loadAvailability(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const onDeleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((list) => list.filter((e) => e._id !== id));
      if (eventId === id) {
        const first = events.find((e) => e._id !== id);
        setEventId(first?._id || "");
      }
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 grid place-items-center">
          <div className="flex items-center gap-3 text-gray-700">
            <Spinner /> <span>Loading Booking & Tickets…</span>
          </div>
        </main>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 text-red-600">{err}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white shadow p-5 flex flex-wrap items-center gap-4 justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Booking & Tickets</h1>
            {selectedEvent && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <LuCalendarDays />
                {selectedEvent.date
                  ? new Date(selectedEvent.date).toLocaleString()
                  : "No date"}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              className="p-2 rounded-xl border"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>

            <div className="text-xs text-gray-500">
              Capacity: <b>{availability.capacity}</b> • Available:{" "}
              <b>{availability.availableSeats}</b> • Taken:{" "}
              <b>{availability.taken?.length || 0}</b>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl bg-white shadow p-2 flex gap-2 w-full max-w-xl">
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              tab === "seating"
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setTab("seating")}
          >
            Seating
          </button>
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
              tab === "events" ? "bg-indigo-600 text-white" : "hover:bg-gray-50"
            }`}
            onClick={() => setTab("events")}
          >
            Events
          </button>
        </div>

        {tab === "seating" ? (
          // ===== SEATING TAB =====
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Seat map */}
            <section className="lg:col-span-7 rounded-2xl bg-white shadow p-5">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded border bg-white inline-block" />{" "}
                  Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-gray-300 inline-block" />{" "}
                  Taken
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-indigo-600 inline-block" />{" "}
                  Selected
                </span>
              </div>

              <div className="mt-5 overflow-x-auto">
                <div className="inline-block">
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${SEATS_PER_ROW}, minmax(44px, 1fr))`,
                      gap: 8,
                    }}
                  >
                    {seats.map((label) => {
                      const taken = takenSet.has(label);
                      const isSelected = selectedSeat === label;
                      const cls = taken
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-white hover:bg-indigo-50 cursor-pointer";
                      return (
                        <button
                          key={label}
                          disabled={taken}
                          onClick={() =>
                            setSelectedSeat((s) => (s === label ? "" : label))
                          }
                          className={`h-11 rounded-lg border text-sm font-medium ${cls}`}
                          title={taken ? `${label} (taken)` : label}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Seat details + bookings */}
            <section className="lg:col-span-5 space-y-5">
              {/* Seat detail card */}
              <div className="rounded-2xl bg-white shadow p-5">
                <h3 className="font-semibold mb-3">Seat Details</h3>
                {!selectedSeat ? (
                  <div className="text-gray-500 text-sm">
                    Select a seat to see booking info.
                  </div>
                ) : takenSet.has(selectedSeat) ? (
                  (() => {
                    const booking = bookings.find(
                      (b) => b.event?._id === eventId && b.seatNum === selectedSeat
                    );
                    return (
                      <div className="space-y-1 text-sm">
                        <Badge color="failure" className="mb-2">
                          Taken
                        </Badge>
                        <div>
                          <b>Seat:</b> {selectedSeat}
                        </div>
                        <div>
                          <b>Booking ID:</b> {booking?._id || "-"}
                        </div>
                        <div>
                          <b>User:</b> {booking?.user?.email || "-"}
                        </div>
                        <div>
                          <b>Price:</b> {booking?.price ?? "-"}
                        </div>
                        <div>
                          <b>Date:</b>{" "}
                          {booking?.createdAt
                            ? new Date(booking.createdAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    <Badge color="success" className="mb-2">
                      Available
                    </Badge>
                    <div className="text-sm text-gray-600">
                      Seat {selectedSeat} is free.
                    </div>
                  </>
                )}
              </div>

              {/* Bookings list */}
              <div className="rounded-2xl bg-white shadow p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Bookings</h3>
                  <TextInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by email / seat / id"
                    className="w-64"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Seat</th>
                        <th className="py-2 pr-4">User</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr
                          key={b._id}
                          className={`border-b last:border-0 ${
                            selectedSeat === b.seatNum ? "bg-indigo-50" : ""
                          }`}
                          onClick={() => setSelectedSeat(b.seatNum)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="py-2 pr-4 font-medium">{b.seatNum}</td>
                          <td className="py-2 pr-4">{b.user?.email || "-"}</td>
                          <td className="py-2 pr-4">{b.price ?? "-"}</td>
                          <td className="py-2 pr-4">
                            {b.createdAt
                              ? new Date(b.createdAt).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      {!filteredBookings.length && (
                        <tr>
                          <td colSpan={4} className="py-4 text-gray-500">
                            No bookings for this event.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        ) : (
          // ===== EVENTS TAB =====
          <div className="rounded-2xl bg-white shadow p-5">
            {events.length === 0 ? (
              <div className="text-gray-500">No events yet.</div>
            ) : (
              <div className="grid gap-4">
                {events.map((e) => (
                  <div
                    key={e._id}
                    className="rounded-2xl border p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-lg">{e.title}</div>
                      <div className="text-sm text-gray-600">
                        {e.venue || "—"} •{" "}
                        {e.date
                          ? new Date(e.date).toLocaleString()
                          : "No date"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Price: {e.price} • Capacity: {e.capacity} • Available:{" "}
                        {e.availableSeats}
                      </div>
                      {Array.isArray(e.tags) && e.tags.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          Tags: {e.tags.join(", ")}
                        </div>
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
                        onClick={() => onDeleteEvent(e._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => navigate("/admin/event-form")}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                + Add Event
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
