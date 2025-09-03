"use client";


import  Sidebar  from "../../components/Sidebar";


export default function EventDetailsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Event Details
          </h2>

          {/* Event Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-600">Event Name</label>
              <input
                type="text"
                defaultValue="Colombo Music Festival 2025"
                className="w-full mt-1 rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Event Date</label>
              <input
                type="date"
                defaultValue="2025-04-12"
                className="w-full mt-1 rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Event Venue</label>
              <input
                type="text"
                defaultValue="Viharamahadevi Open Air Theater, Colombo"
                className="w-full mt-1 rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Event Time</label>
              <input
                type="text"
                defaultValue="6.00PM – 10.30PM"
                className="w-full mt-1 rounded-lg border border-gray-300 p-2"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600">
              Event Description
            </label>
            <textarea
              rows={4}
              defaultValue="Get ready for Sri Lanka’s biggest music festival – the Colombo Music Festival 2025! 🎶✨ ..."
              className="w-full mt-1 rounded-lg border border-gray-300 p-2"
            />
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg border text-center">
              <p className="text-sm text-gray-600">Ticket Price</p>
              <p className="font-bold text-gray-800">2500 LKR</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-sm text-gray-600">Seat Amount</p>
              <p className="font-bold text-gray-800">1200</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-sm text-gray-600">Available Seats</p>
              <p className="font-bold text-gray-800">523</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-sm text-gray-600">Popularity</p>
              <p className="font-bold text-gray-800">High</p>
            </div>
          </div>

          {/* Seat Allocation */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Seat Allocation</h3>
            <div className="grid grid-cols-20 gap-1 w-full bg-gray-50 p-4 rounded-lg">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-sm ${
                    i % 3 === 0
                      ? "bg-purple-500"
                      : i % 5 === 0
                      ? "bg-gray-400"
                      : "bg-white border"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-purple-500 rounded-sm"></span> Paid
                Seats
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-400 rounded-sm"></span>{" "}
                Reserved
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 border bg-white rounded-sm"></span>{" "}
                Available
              </div>
            </div>
          </div>

          {/* Tags + QR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm text-gray-600">Tags</label>
              <input
                type="text"
                defaultValue="#Music, #Festival"
                className="w-full mt-1 rounded-lg border border-gray-300 p-2"
              />
              <p className="text-sm text-gray-600 mt-2">
                Expected Attendance: <span className="font-bold">+1000</span>
              </p>
            </div>
            <div className="flex flex-col items-center justify-center border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                Scan QR code for easy payments
              </p>
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4">
            <button className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700">
              Edit
            </button>
            <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white">
              Attendee Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
