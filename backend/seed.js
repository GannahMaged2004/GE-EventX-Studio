// Expermiental seed file to create initial users and events


import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();
await connectDB();

const run = async () => {
  await User.deleteMany();
  await Event.deleteMany();

  // Create Admin
  const admin = await User.create({
    name: "Admin User",
    email: "admin@eventx.com",
    password: "password123", 
    role: "admin",
    age: 30,
    gender: "male",
    interests: ["EDM", "Innovation"],
    location: "Colombo"
  });

  //  another user
  const user1 = await User.create({
    name: "Alice",
    email: "alice@eventx.com",
    password: "password123",
    role: "user",
    age: 26,
    gender: "female",
    interests: ["Live Music", "Food"],
    location: "Kandy"
  });

  // an event
  const ev = await Event.create({
    title: "Colombo Music Festival 2025",
    description: "Best music festival...",
    date: new Date("2025-04-12"),
    venue: "Viharamahadevi Open Air Theatre",
    price: 2500,
    capacity: 1200,       
    availableSeats: 1200,  
    tags: ["Music", "Festival"],
    popularity: "High",
    creator: admin._id    
  });

  console.log("Seed done");
  process.exit();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
