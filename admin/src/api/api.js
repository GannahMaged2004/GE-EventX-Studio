// creating an API client.
import axios from "axios";

// environment variables
const raw = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const API_BASE = raw.endsWith("/api") ? raw : `${raw}/api`;

const API = axios.create({ baseURL: API_BASE });

// Here we are using interceptors to add token to the headers of each request
API.interceptors.request.use((req) => {
  let token = localStorage.getItem("token");
  if (typeof token === "string") token = token.trim().replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");
  if (token && token !== "undefined" && token !== "null") {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    delete req.headers.Authorization;
  }
  return req;
});


// Here we are defining a helper function to convert errors to a standard format.
const asError = (err, fallback) => {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;
  const e = new Error(msg);
  e.status = err?.response?.status;
  e.data = err?.response?.data;
  return e;
};

// ===== AUTH =====
export async function login(payload) {
  try {
    const { data } = await API.post("/auth/login", payload);
    return data;
  } catch (e) { throw asError(e, "Login failed"); }
}

export async function register(payload) {
  try {
    const { data } = await API.post("/auth/register", payload);
    return data;
  } catch (e) { throw asError(e, "Registration failed"); }
}

export async function getProfile() {
  try {
    const { data } = await API.get("/auth/profile");
    return data;
  } catch (e) { throw asError(e, "Failed to fetch profile"); }
}

// ===== EVENTS =====
export async function getEvents(params = {}) {
  try { const { data } = await API.get("/events", { params }); return data; }
  catch (e) { throw asError(e, "Failed to fetch events"); }
}

export async function getEvent(id) {
  try { const { data } = await API.get(`/events/${id}`); return data; }
  catch (e) { throw asError(e, "Failed to fetch event"); }
}

export async function createEvent(payload) {
  try { const { data } = await API.post("/events", payload); return data; }
  catch (e) { throw asError(e, "Failed to create event"); }
}

export async function updateEvent(id, payload) {
  try { const { data } = await API.put(`/events/${id}`, payload); return data; }
  catch (e) { throw asError(e, "Failed to update event"); }
}

export async function deleteEvent(id) {
  try { const { data } = await API.delete(`/events/${id}`); return data; }
  catch (e) { throw asError(e, "Failed to delete event"); }
}

// ===== BOOKINGS =====
export const getAllBookings = (params = {}) =>
  API.get("/bookings", { params }).then(r => r.data);

export const getUserBookings = () =>
  API.get("/bookings/my").then(r => r.data);

export const createBooking = (eventId, { seatNum }) =>
  API.post(`/bookings/${eventId}`, { seatNum }).then(r => r.data);

// ===== ANALYTICS & EXPORTS =====
export const getOverview = () => API.get("/analytics/overview").then(r => r.data);
export const getDemographics = () => API.get("/analytics/demographics").then(r => r.data);

export const exportReportCSV = async () =>
  (await API.get("/analytics/export/csv", { responseType: "blob" })).data;

export const exportReportExcel = async () =>
  (await API.get("/analytics/export/excel", { responseType: "blob" })).data;
