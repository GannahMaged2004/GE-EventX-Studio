import express from 'express';
import { createBooking, getUserBookings, getAllBookings } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:eventId', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/', protect, admin, getAllBookings);

export default router;
