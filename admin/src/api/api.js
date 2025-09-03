import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth endpoints
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getProfile = () => API.get("/auth/profile");

// Event endpoints
export const getEvents = (params) => API.get("/events", { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Booking endpoints
export const createBooking = (eventId, data) => API.post(`/bookings/${eventId}`, data);
export const getMyBookings = () => API.get("/bookings/my");
export const getAllBookings = () => API.get("/bookings");

// Analytics endpoints
export const getOverview = () => API.get("/analytics/overview");
export const getDemographics = () => API.get("/analytics/demographics");
export const exportCSV = () => API.get("/analytics/export/csv");
export const exportExcel = () => API.get("/analytics/export/excel");