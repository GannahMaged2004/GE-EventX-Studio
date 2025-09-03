import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import  Sidebar  from "../../components/Sidebar";

export default function AttendeeInsights() {
  // ===== Dummy Data (replace with API later) =====
  const ageData = [
    { day: "01", "18-24": 12, "25-34": 20, "35-44": 8, "45+": 5 },
    { day: "02", "18-24": 15, "25-34": 18, "35-44": 9, "45+": 7 },
    { day: "03", "18-24": 11, "25-34": 14, "35-44": 10, "45+": 6 },
    { day: "04", "18-24": 14, "25-34": 22, "35-44": 11, "45+": 8 },
  ];

  const interestData = [
    { name: "Live Music", value: 35 },
    { name: "Innovation", value: 50 },
    { name: "EDM Music", value: 25 },
    { name: "Food Festivals", value: 35 },
  ];

  const COLORS = ["#3B82F6", "#F43F5E", "#FACC15", "#10B981"];

  const locationData = [
    { name: "Colombo", value: 227 },
    { name: "Kandy", value: 123 },
    { name: "Galle", value: 143 },
    { name: "Jaffna", value: 70 },
    { name: "International", value: 52 },
  ];

  // ===== JSX Layout =====
  return (
    <div className="flex bg-white rounded-xl shadow p-6 w-full">
      {/* Sidebar */}
      <Sidebar />


      {/* Main content */}
      <main className="flex-1 px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Attendee Insights – Colombo Music Festival 2025
            </h1>
            <p className="text-gray-600">
              Event Venue: Viharamahadevi Open Air Theater, Colombo <br />
              Event Date: April 12, 2025 – Event Time: 6.00PM – 10.30PM
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-3 py-2"
            />
            <button className="bg-gray-200 px-3 py-2 rounded-lg">Attendees: 523</button>
            <button className="bg-gray-200 px-3 py-2 rounded-lg">Filter</button>
          </div>
        </div>

        {/* Row 1: Age + Engagement */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Attendee Age</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="18-24" fill="#3B82F6" />
                <Bar dataKey="25-34" fill="#F43F5E" />
                <Bar dataKey="35-44" fill="#FACC15" />
                <Bar dataKey="45+" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Engagement & Social Media Reach</h2>
            <ul className="space-y-3">
              <li className="flex justify-between"><span>Instagram Mentions</span> <span className="font-bold text-blue-600">5,200</span></li>
              <li className="flex justify-between"><span>Facebook Shares</span> <span className="font-bold text-green-600">3,800</span></li>
              <li className="flex justify-between"><span>Twitter Tweets</span> <span className="font-bold text-sky-600">1,200</span></li>
              <li className="flex justify-between"><span>Event Check-ins</span> <span className="font-bold text-purple-600">9,500</span></li>
              <hr />
              <li className="flex justify-between"><span>Total Count</span> <span className="font-bold">19,700</span></li>
            </ul>
          </div>
        </div>

        {/* Row 2: Interests + Locations */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Attendee Interests</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={interestData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow col-span-2">
            <h2 className="font-semibold mb-4">Attendee Locations</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>

              {/* Table */}
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((loc, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{loc.name}</td>
                      <td className="p-2 border">{loc.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
