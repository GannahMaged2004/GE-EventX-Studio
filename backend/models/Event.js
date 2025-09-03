// model for Event

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
    },
    description: {
    type: String,
    required: true,
    },
    date: {
    type: Date,
    required: true,
    },
    venue:String,
    price:{
    type: Number,
    required: true,
    },
    capacity:{
    type: Number,
    required: true,
    min: 1,
    },
    availableSeats:{
    type: Number,
    required: true,
    min: 0
    },
    tags: [{ type: String }],
    // high, medium, low
    popularity: {type:String},
    creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    }
},
    {
    timestamps: true,
    });

eventSchema.pre("save", function (next) {
  if (this.isNew && this.availableSeats == null) {
    this.availableSeats = this.capacity;
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);
export default Event;