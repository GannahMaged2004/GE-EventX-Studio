// Reports.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getOverview, getAllBookings, exportReportCSV, exportReportExcel } from "../../api/api";
import { downloadBlob } from "../../utils/downloadBlob";
import { Spinner } from "flowbite-react";
export default function Reports() {
  const [kpi, setKpi] = useState({ totalRevenue: 0, ticketsSold: 0, attendees: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [overview, list] = await Promise.all([ getOverview(), getAllBookings() ]);
        setKpi(overview || {});
        setBookings(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onExportCSV = async () => {
    try {
      const blob = await exportReportCSV();
      downloadBlob(blob, "user_analytics.csv");
    } catch (e) {
      alert(e.message || "CSV export failed");
    }
  };

  const onExportExcel = async () => {
    try {
      const blob = await exportReportExcel();
      downloadBlob(blob, "user_analytics.xlsx");
    } catch (e) {
      alert(e.message || "Excel export failed");
    }
  };

  return (
    
    <div className="flex min-h-screen bg-gray-50 ">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="flex gap-2">
            <button onClick={onExportCSV} className="px-4 py-2 rounded-xl border">Export CSV</button>
            <button onClick={onExportExcel} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Export Excel</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Revenue", value: kpi.totalRevenue },
            { label: "Tickets Sold", value: kpi.ticketsSold },
            { label: "Attendees", value: kpi.attendees },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl shadow bg-white p-4">
              <div className="text-gray-500">{c.label}</div>
              <div className="text-3xl font-bold">{c.value ?? "-"}</div>
            </div>
          ))}
        </div>

        {/* Bookings table */}
        {loading ? <div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div> : err ? <div className="text-red-600">{err}</div> : (
          <div className="rounded-2xl shadow bg-white p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Booking ID</th>
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Seat</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{b._id}</td>
                    <td className="py-2 pr-4">{b.event?.title || "-"}</td>
                    <td className="py-2 pr-4">{b.user?.email || "-"}</td>
                    <td className="py-2 pr-4">{b.seatNum || "-"}</td>
                    <td className="py-2 pr-4">{b.price ?? "-"}</td>
                    <td className="py-2 pr-4">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
                {!bookings.length && (
                  <tr><td colSpan={6} className="py-4 text-gray-500">No bookings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
