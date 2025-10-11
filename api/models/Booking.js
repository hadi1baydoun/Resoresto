import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  restaurantName: { type: String, required: true },
  seatingPreference: { 
    type: String, 
    required: true, 
    enum: ['indoor', 'outdoor', 'window-side'] // Optional validation
  },
  guests: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' } // Optional: To track reservation status
});

// Adding indexes for faster query performance
bookingSchema.index({ userId: 1, placeId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
