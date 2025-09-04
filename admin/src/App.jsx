import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/admin/Dashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import EventForm from "./pages/admin/EventForm";
import Reports from "./pages/admin/Reports";
import AttendeeInsights from "./pages/admin/AttendeeInsights";
import Tickets from "./pages/admin/Tickets";
import BrowseEvents from "./pages/user/BrowseEvents";
import EventDetails from "./pages/user/EventDetails";
import MyTickets from "./pages/user/MyTickets";
import Profile from "./pages/user/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* USER (signed-in) */}
<Route element={<ProtectedRoute />}>

  <Route path="/user/browse" element={<BrowseEvents />} />
  <Route path="/user/events/:id" element={<EventDetails />} />
  <Route path="/user/tickets" element={<MyTickets />} />
  <Route path="/user/profile" element={<Profile />} />
</Route>

<Route element={<ProtectedRoute allowedRole="admin" />}>
  {/* admin only */}
  <Route path="/admin/dashboard" element={<Dashboard />} />
  <Route path="/admin/manage-events" element={<ManageEvents />} />
  <Route path="/admin/event-form" element={<EventForm />} />
  <Route path="/admin/event-form/:id" element={<EventForm />} />
  <Route path="/admin/reports" element={<Reports />} />
  <Route path="/admin/attendees" element={<AttendeeInsights />} />
<Route path="/admin/tickets" element={<Tickets />} />

</Route>
        {/* 404 LAST */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
