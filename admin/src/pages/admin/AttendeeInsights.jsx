// AttendeeInsights.jsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spinner } from "flowbite-react";
import { getDemographics } from "../../api/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

const COLORS = ["#8b5cf6","#7c3aed","#c084fc","#10b981","#f59e0b","#ef4444","#14b8a6","#f472b6","#22c55e","#0ea5e9"];

const toPairs = (obj) => Object.entries(obj || {}).map(([name, value]) => ({ name, value }));

export default function AttendeeInsights() {
  const [data, setData] = useState({ ageDistribution:{}, genders:{}, interests:{}, locations:{} });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const d = await getDemographics();
        setData(d || {});
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load demographics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ageData = toPairs(data.ageDistribution);
  const genderData = toPairs(data.genders);
  const locationData = toPairs(data.locations);
  const interestsData = toPairs(data.interests)
    .sort((a,b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Attendee Insights</h1>

        {loading ? <div><div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div></div> : err ? <div className="text-red-600">{err}</div> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <div className="rounded-2xl shadow bg-white p-4">
              <h3 className="mb-2 font-semibold">Age Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={ageData} dataKey="value" nameKey="name" outerRadius={90}>
                    {ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip/><Legend/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gender */}
            <div className="rounded-2xl shadow bg-white p-4">
              <h3 className="mb-2 font-semibold">Gender</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90}>
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip/><Legend/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Interests */}
            <div className="rounded-2xl shadow bg-white p-4">
              <h3 className="mb-2 font-semibold">Top Interests</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={interestsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /><YAxis allowDecimals={false}/><Tooltip/>
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Locations */}
            <div className="rounded-2xl shadow bg-white p-4">
              <h3 className="mb-2 font-semibold">Locations</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /><YAxis allowDecimals={false}/><Tooltip/>
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
