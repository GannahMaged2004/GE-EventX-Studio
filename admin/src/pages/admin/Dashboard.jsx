import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Spinner } from "flowbite-react";
import { getOverview, getDemographics } from "../../api/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";


const COLORS = ["#8b5cf6","#7c3aed","#c084fc","#10b981","#f59e0b","#ef4444"];

export default function Dashboard() {
  const [kpi, setKpi] = useState({ totalRevenue:0, ticketsSold:0, attendees:0 });
  const [demo, setDemo] = useState({ ageDistribution:{}, genders:{}, locations:{} });
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const a = await getOverview();
      const d = await getDemographics();
      setKpi({
        totalRevenue: a?.totalRevenue ?? 0,
        ticketsSold:  a?.ticketsSold  ?? 0,
        attendees:    a?.attendees    ?? 0,
      });
      setDemo({
        ageDistribution: d?.ageDistribution ?? {},
        genders:         d?.genders         ?? {},
        locations:       d?.locations       ?? {},
      });
    } finally { setLoading(false); }
  })(); }, []);

  const ageData = Object.entries(demo.ageDistribution).map(([name,value])=>({name,value}));
  const locationData = Object.entries(demo.locations).map(([name,value])=>({name,value}));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {loading ?  <div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div>: (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {label:"Revenue", value:kpi.totalRevenue},
                {label:"Tickets Sold", value:kpi.ticketsSold},
                {label:"Attendees", value:kpi.attendees},
              ].map((c,i)=>(
                <div key={i} className="rounded-2xl shadow bg-white p-4">
                  <div className="text-gray-500">{c.label}</div>
                  <div className="text-3xl font-bold">{c.value ?? "-"}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl shadow bg-white p-4">
                <h3 className="mb-2 font-semibold">Age Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={ageData} dataKey="value" nameKey="name" outerRadius={90}>
                      {ageData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Tooltip/><Legend/>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl shadow bg-white p-4">
                <h3 className="mb-2 font-semibold">Locations</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/><YAxis/><Tooltip/>
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
