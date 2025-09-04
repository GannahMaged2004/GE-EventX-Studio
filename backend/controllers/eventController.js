// In this controller we have the functions to create, get, update, and delete events.
import Event, { CATEGORY_IMAGE } from '../models/Event.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      title, description, date, venue,
      price, capacity, tags, popularity,
      category, imageUrl,
    } = req.body;

    const priceNum = Number(price);
    const capNum   = Number(capacity);
    const dt       = new Date(date);

    if (!title || !description || !date)
      return res.status(400).json({ message: "title, description, and date are required" });

    if (!category || !['concert', 'theatre', 'football'].includes(category))
      return res.status(400).json({ message: "category must be one of: concert, theatre, football" });

    if (Number.isNaN(priceNum) || Number.isNaN(capNum))
      return res.status(400).json({ message: "price and capacity must be numbers" });

    if (capNum < 1)
      return res.status(400).json({ message: "capacity must be at least 1" });

    if (isNaN(dt.getTime()))
      return res.status(400).json({ message: "date is invalid" });

    const finalImage = imageUrl || CATEGORY_IMAGE[category];

    const event = await Event.create({
      title,
      description,
      date: dt,
      venue: venue || "",
      price: priceNum,
      capacity: capNum,
      availableSeats: capNum,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s=>s.trim()).filter(Boolean) : []),
      popularity: popularity || 'medium',
      category,
      imageUrl: finalImage,
      creator: req.user._id,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all events 
export const getEvents = async (req, res) => {
  try {
    const { search, date, tag, category } = req.query;
    const query = {};
    if (search)   query.title = { $regex: search, $options: 'i' };
    if (date)     query.date  = { $gte: new Date(date) };
    if (tag)      query.tags  = tag;
    if (category) query.category = category;

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update event by ID
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { category, imageUrl } = req.body;

    Object.assign(event, req.body);

    // keep availableSeats within capacity
    if (typeof event.capacity === 'number' && typeof event.availableSeats === 'number') {
      if (event.availableSeats > event.capacity) event.availableSeats = event.capacity;
      if (event.availableSeats < 0) event.availableSeats = 0;
    }

    // If category changed and no explicit imageUrl provided, set the default
    if (category && !imageUrl && CATEGORY_IMAGE[category]) {
      event.imageUrl = CATEGORY_IMAGE[category];
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete event by ID
export const deleteEvent = async (req, res) => {
  try {
    const found = await Event.findById(req.params.id);
    if (!found) return res.status(404).json({ message: 'Event not found' });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
