import {
  FiMoreVertical, FiShare2, FiChevronRight, FiMapPin, FiCalendar, FiClock,
} from "react-icons/fi";
import { Badge } from "flowbite-react";
import { LuTicket } from "react-icons/lu";
import { TbCurrencyRupee } from "react-icons/tb"; // visually close to LKR

export default function EventCard({ event }) {
  const statusColor =
    event.status === "upcoming" ? "info" : event.status === "pending" ? "warning" : "failure";

  return (
    <div className="relative rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-4 hover:shadow-md transition">
      {/* top row */}
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
                <LuTicket className="text-base" /> {event.sold}
              </span>
              <span className="inline-flex items-center gap-1">
                <LuTicket className="text-base opacity-50" /> {event.available}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge color={statusColor} className="capitalize">{event.status}</Badge>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* details */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2"><FiMapPin /> <span className="truncate">{event.venue}</span></div>
        <div className="flex items-center gap-2"><FiCalendar /> <span>{event.date}</span></div>
        <div className="flex items-center gap-2"><FiClock /> <span>{event.time}</span></div>
      </div>

      {/* footer actions */}
      <div className="mt-4 flex items-center justify-between">
        <button className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline">
          <FiShare2 /> Share
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-full border border-gray-200 hover:bg-gray-50">
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
