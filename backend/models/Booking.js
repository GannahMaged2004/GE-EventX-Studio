// Model for Booking
import mongoose from'mongoose';

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    // ex: Ae102
    seatNum:{
        type:String,
        required:true
    },
    price:{
        type:Number,    
        required:true  
    },
    status:{
        type:String,
        required:true,
        enum:["pending","paid"],
        default:"pending"
    },
    qrCode: {type: String} // URL or base64 string of the QR code image
},
    {
    timestamps: true
    });
export default mongoose.model('Booking', BookingSchema);