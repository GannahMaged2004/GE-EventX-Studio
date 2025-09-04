// Booking 
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import QRCode from 'qrcode';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { seatNum } = req.body;
    const userId = req.user._id;
    const eventId = req.params.eventId;

    if (!seatNum || !String(seatNum).trim()) {
      return res.status(400).json({ message: 'Seat number is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // block booking for past events
    if (new Date(event.date).getTime() < Date.now()) {
      return res.status(400).json({ message: 'This event has already occurred' });
    }

    // block booking when no seats
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: 'No available seats' });
    }

    // Check if seatNum is already booked for this event
    const existingBooking = await Booking.findOne({ event: eventId, seatNum });
    if (existingBooking) return res.status(400).json({ message: 'Seat already booked' });


    // QR Code generation 
    const qrData =  `event:${eventId};user:${userId};seat:${seatNum};time:${Date.now()}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      seatNum,
      price: event.price,
      status: 'paid',
      qrCode: qrCode
    });

    // Decrease available seats
    event.availableSeats -= 1;
    await event.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get bookings for the logged-in userr
// Get all bookings

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate('event')                         
      .populate('user', 'name email');           
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const {eventId} = req.query;
    const query= {};
    if(eventId)
      query.event= eventId;
    const bookings = await Booking.find(query).populate('event user');
    res.json(bookings);
  }
  catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

