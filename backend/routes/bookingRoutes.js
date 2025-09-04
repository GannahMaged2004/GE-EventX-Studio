// Booking Routes
import express from 'express';
import { createBooking, getUserBookings, getAllBookings , getEventAvailability } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:eventId', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/', protect, admin, getAllBookings);
router.get('/availability/:eventId', protect, getEventAvailability);
export default router;
