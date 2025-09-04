// Here is the Event Card component which displays the images the title so and so
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FiMoreVertical, FiShare2, FiChevronRight, FiMapPin, FiCalendar, FiClock,
} from "react-icons/fi";
import { Badge } from "flowbite-react";
import { LuTicket } from "react-icons/lu";
import { TbCurrencyRupee } from "react-icons/tb";

// this function is used to display the event card

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // the useEffect hook is used to close the menu when the user clicks outside of it
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const link = `${window.location.origin}/user/events/${event._id}`;

  const status =
    event.status ||
    (event.date && new Date(event.date).getTime() > Date.now() ? "upcoming" : "closed");

  const statusColor = status === "upcoming" ? "info" : status === "pending" ? "warning" : "failure";

  // this function is used to navigate to the event details page
  const goToDetails = () => navigate(`/user/events/${event._id}`); // booking lives there

  // this function is used to copy the event link to the clipboard or share it using the share API
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: "Check out this event on EventX Studio",
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* user canceled share; ignore */
    } finally {
      setMenuOpen(false);
    }
  };

  // Here is the event card component return 
  return (
    <div className="relative rounded-2xl  shadow-sm ring-1 ring-gray-100 p-4 hover:shadow-md transition bg-white">
      {/* cover image */}
      {event.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden">
          <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-xl bg-indigo-50 text-indigo-600 text-xl">
            {event.icon}
          </div>
          <div>
            <h3 className="font-semibold leading-tight">{event.title}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <TbCurrencyRupee className="text-base" /> {event.price}
              </span>
              <span className="inline-flex items-center gap-1">
                <LuTicket className="text-base opacity-50" /> {event.availableSeats ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <Badge color={statusColor} className="capitalize">{status}</Badge>

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="More actions"
          >
            <FiMoreVertical />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border bg-white shadow-lg p-1">
              <button
                onClick={goToDetails}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                View details
              </button>
              <button
                onClick={goToDetails}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Book now
              </button>
              <button
                onClick={handleShare}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FiMapPin /> <span className="truncate">{event.venue || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar />{" "}
          <span>{event.date ? new Date(event.date).toLocaleDateString() : "No date"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock />{" "}
          <span>{event.date ? new Date(event.date).toLocaleTimeString() : "—"}</span>
        </div>
        {event.category && (
          <div className="text-xs text-gray-500">Category: {event.category}</div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
        >
          <FiShare2 /> Share
        </button>

        <button
          onClick={goToDetails}
          className="h-9 w-9 grid place-items-center rounded-full border border-gray-200 hover:bg-gray-50"
          title="Book tickets"
          aria-label="Book tickets"
        >
          <FiChevronRight />
        </button>
      </div>


      {copied && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black/80 text-white text-xs">
          Link copied
        </div>
      )}
    </div>
  );
}
