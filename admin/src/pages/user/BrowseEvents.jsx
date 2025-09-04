// Browse Events
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getEvents } from "../../api/api";
import EventCard from "../../components/EventCard";
import { useAuth } from "../../context/useAuth";
import { Spinner } from "flowbite-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


// this function is used to render the browse events page
// it uses the useAuth and api functions from the context and api files respectively
export default function BrowseEvents() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // the events state and loading state are used to display the events and show a loading spinner
  // the error state is used to display any errors that occur
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // the category state and dateFrom state are used to filter the events by category and date
  // the sort state is used to sort the events by date or price

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("date") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "dateAsc");

  // pagination is used to display events in pages of 9 events
  // the page state is used to keep track of the current page
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);
  // this effect is used to sync the url when the filters change
  // so that the user can share the page
  // Sync URL when filters change (so you can share the page)
  useEffect(() => {
    const next = {};
    if (q.trim()) next.q = q.trim();
    if (category) next.category = category;
    if (dateFrom) next.date = dateFrom;
    if (sort && sort !== "dateAsc") next.sort = sort;
    setSearchParams(next, { replace: true });
  }, [q, category, dateFrom, sort, setSearchParams]);

  // Fetch from API whenever server-side filters change
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const params = {};
        if (q.trim()) params.search = q.trim();
        if (category) params.category = category;
        if (dateFrom) params.date = dateFrom;
        const data = await getEvents(params);
        if (!cancelled) {
          setEvents(Array.isArray(data) ? data : []);
          setPage(1);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(e.message || "Failed to load events");
          setEvents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); 

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q, category, dateFrom]);

  // is sorts the events based on the sort state
  const sorted = useMemo(() => {
    const list = [...events];
    switch (sort) {
      case "dateDesc":
        return list.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "priceAsc":
        return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case "priceDesc":
        return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case "dateAsc":
      default:
        return list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  }, [events, sort]);

 
  const visible = useMemo(() => sorted.slice(0, page * PAGE_SIZE), [sorted, page]);
  const hasMore = visible.length < sorted.length;

  const clearFilters = () => {
    setQ("");
    setCategory("");
    setDateFrom("");
    setSort("dateAsc");
  };

  // Logout
  const doLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Render
  return (
    <div className="min-h-screen bg-white">
     
      <div>
        <Navbar />
      </div>

 
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold mb-4 text-white text-center">Browse Events</h1>

        <div className="rounded-2xl bg-white/95 backdrop-blur p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Search by title</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g., Coldplay, Comedy Night…"
                className="w-full p-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="">All</option>
                <option value="concert">Concert</option>
                <option value="theatre">Theatre</option>
                <option value="football">Football</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Date from</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-2 rounded-lg border"
              >
                <option value="dateAsc">Date ↑</option>
                <option value="dateDesc">Date ↓</option>
                <option value="priceAsc">Price ↑</option>
                <option value="priceDesc">Price ↓</option>
              </select>
            </div>

            <button onClick={clearFilters} className="px-3 py-2 rounded-lg border hover:bg-gray-50">
              Clear
            </button>

            <span className="ml-auto text-sm text-gray-600">
              Showing <b>{visible.length}</b> of <b>{sorted.length}</b> event{sorted.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

    
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {loading && <div className="p-6 text-white"><div>Loading… 
            <Spinner aria-label="Default status example"/>;
          </div></div>}
        {error && <div className="p-6 text-red-300">Error: {error}</div>}

        {!loading && !error && sorted.length === 0 && (
          <div className="p-6 text-gray-200">No events found. Try different filters.</div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <>
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((ev, i) => (
                <EventCard
                  key={ev._id}
                  event={ev}
                  // keep EventCard interactions (kebab/arrow/share)
                />
              ))}
            </div>


            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Load more
                </button>
              </div>
              
            )}

          </>
        )}
        
        <div className="bg-gray-900">
          <Footer />
        </div>
        
      </div>

    </div>
  );
}
