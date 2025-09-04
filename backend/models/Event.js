// model for Event
// This model is used to store event details.
// The frontend can use this model to display events.
// The backend can use this model to create, update, and delete events.
import mongoose from 'mongoose';

const CATEGORY_IMAGE = {
  concert:  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',   // crowd / concert
  theatre:  'https://images.unsplash.com/photo-1515165562835-c4076a5d3c37',   // theatre stage
  football: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a',   // football (soccer) stadium
};

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: Date,   required: true },
  venue:       { type: String },
  price:       { type: Number, required: true },
  capacity:    { type: Number, required: true, min: 1 },

  availableSeats: {
    type: Number,
    min: 0,
    default: function () { return this.capacity; },
  },

  // To store image URL
  category: {
    type: String,
    enum: ['concert', 'theatre', 'football'],
    required: false,
  },

  
  imageUrl: {
    type: String,
    default: function () {
      if (this.category && CATEGORY_IMAGE[this.category]) {
        return CATEGORY_IMAGE[this.category];
      }
      return undefined;
    },
  },

  tags:       [{ type: String }],
  popularity: { type: String }, // "high" | "medium" | "low"
  creator:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
export { CATEGORY_IMAGE }; 
