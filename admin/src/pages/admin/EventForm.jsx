import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { createEvent, updateEvent, getEvent } from "../../api/api";
import concertImage from "../../../public/concert.jpg";
import theatreImage from "../../../public/theatre.jpg";
import footballImage from "../../../public/sports.jpg";

const CATEGORY_IMAGE = {
  concert: concertImage,
  theatre: theatreImage,
  football: footballImage,
};

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    price: "",
    capacity: "",
    tags: "",
    popularity: "medium",
    category: "concert",
    imageUrl: CATEGORY_IMAGE["concert"],
  });

  // Load event if editing
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const e = await getEvent(id);
        setForm({
          title: e.title || "",
          description: e.description || "",
          date: e.date ? new Date(e.date).toISOString().slice(0, 16) : "",
          venue: e.venue || "",
          price: e.price ?? "",
          capacity: e.capacity ?? "",
          tags: (e.tags || []).join(", "),
          popularity: e.popularity || "medium",
          category: e.category || "concert",
          imageUrl: e.imageUrl || CATEGORY_IMAGE[e.category || "concert"],
        });
      } catch (error) {
        console.error(error);
        setErr("Failed to load event");
      }
    })();
  }, [id]);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onCategoryChange = (e) => {
    const value = e.target.value;
    setForm((s) => ({
      ...s,
      category: value,
      imageUrl: CATEGORY_IMAGE[value] || s.imageUrl,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date ? new Date(form.date).toISOString() : null,
        venue: form.venue.trim(),
        price: Number(form.price),
        capacity: Number(form.capacity),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        popularity: form.popularity,
        category: form.category,
        imageUrl: form.imageUrl,
      };

      if (id) {
        await updateEvent(id, payload);
      } else {
        payload.availableSeats = payload.capacity; // only set when creating
        await createEvent(payload);
      }

      navigate("/admin/manage-events");
    } catch (error) {
      console.error(error);
      setErr(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
 <main className="flex-1 p-4 sm:p-6 lg:p-8">
  <h1 className="text-xl sm:text-2xl font-bold mb-6">
    {id ? "Edit Event" : "Add New Event"}
  </h1>

  {/* Error Message */}
  {err && (
    <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{err}</div>
  )}

  {/* Image Preview */}
  <div className="mb-4">
    <div className="text-sm text-gray-600 mb-2">Image Preview</div>
    <div className="rounded-xl overflow-hidden border w-full max-w-full sm:max-w-xl">
      <img
        src={form.imageUrl}
        alt={form.category}
        className="w-full h-auto sm:h-56 object-cover"
        onError={(e) => {
          e.currentTarget.src = CATEGORY_IMAGE[form.category];
        }}
      />
    </div>
  </div>

  <form
    onSubmit={onSubmit}
    className="grid grid-cols-1 gap-4 w-full max-w-full sm:max-w-2xl bg-white p-4 sm:p-6 rounded-xl shadow"
  >
    <input
      name="title"
      value={form.title}
      onChange={onChange}
      placeholder="Title"
      className="p-3 rounded-xl border w-full"
      required
    />
    <textarea
      name="description"
      value={form.description}
      onChange={onChange}
      placeholder="Description"
      className="p-3 rounded-xl border w-full"
      rows={4}
      required
    />
    <input
      type="datetime-local"
      name="date"
      value={form.date}
      onChange={onChange}
      className="p-3 rounded-xl border w-full"
      required
    />
    <input
      name="venue"
      value={form.venue}
      onChange={onChange}
      placeholder="Venue"
      className="p-3 rounded-xl border w-full"
    />

    {/* Category + Image URL */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={onCategoryChange}
          className="p-3 rounded-xl border w-full"
        >
          <option value="concert">Concert</option>
          <option value="theatre">Theatre</option>
          <option value="football">Football</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Image URL (auto-filled, editable)
        </label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={onChange}
          placeholder="https://..."
          className="p-3 rounded-xl border w-full"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        type="number"
        min="0"
        step="0.01"
        name="price"
        value={form.price}
        onChange={onChange}
        placeholder="Price"
        className="p-3 rounded-xl border w-full"
        required
      />
      <input
        type="number"
        min="1"
        name="capacity"
        value={form.capacity}
        onChange={onChange}
        placeholder="Capacity"
        className="p-3 rounded-xl border w-full"
        required
      />
    </div>

    <input
      name="tags"
      value={form.tags}
      onChange={onChange}
      placeholder="Tags (comma separated)"
      className="p-3 rounded-xl border w-full"
    />
    <select
      name="popularity"
      value={form.popularity}
      onChange={onChange}
      className="p-3 rounded-xl border w-full"
    >
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>

    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <button
        disabled={saving}
        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : id ? "Update Event" : "Create Event"}
      </button>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border"
      >
        Cancel
      </button>
    </div>
  </form>
</main>

    </div>
  );
}
