// event 

import e from 'express';
import Event from '../models/Event.js';


// Create a new event
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, price, capacity, tags, popularity } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            venue,
            price,
            availableSeats: capacity,
            tags,
            popularity,
            creator: req.user._id,
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all events with optional query filters

export const getEvents = async (req, res) => {
    try{
        const {search,date,tag} = req.query;
        let query = {};
        if(search){
            query.title = {$regex: search, $options: 'i'};
        }
        if(date){
            query.date = {$gte: new Date(date)};
        }
        if(tag){
            query.tags = tag;
        }
        const events = await Event.find(query).sort({date:1});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get event by ID
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) 
            return res.status(404).json({ message: 'Event not found' });

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
     


// Update event by ID
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) 
            return res.status(404).json({ message: 'Event not found' });
        Object.assign(event, req.body);
        // Ensure availableSeats does not exceed capacity
        if (event.availableSeats > event.capacity) 
            event.availableSeats = event.capacity;
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
        }
};

// Delete event by ID
export const deleteEvent = async (req, res) => {
    try {
         await Event.findByIdAndDelete(req.params.id);
            res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }   
};
        

