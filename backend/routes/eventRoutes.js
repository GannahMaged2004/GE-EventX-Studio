import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect,admin, createEvent);
router.put('/:id', protect,admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);
export default router;