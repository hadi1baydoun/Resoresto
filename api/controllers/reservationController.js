// controllers/reservationController.js
import Reservation from '../models/Reservation';
import Booking from '../models/Booking';
import Place from '../models/Place';

export const createReservation = async (req, res) => {
  const { placeId, date, guests, seatingPreference } = req.body;

  try {
    // Process the reservation (save it to the reservations collection)
    const reservation = new Reservation({
      userId: req.user._id, // Assuming you're getting the user from the session
      placeId,
      date,
      guests,
      seatingPreference,
    });
    await reservation.save();

    // Now save it to the user's bookings
    const place = await Place.findById(placeId); // Get the place name

    const booking = new Booking({
      userId: req.user._id,
      placeId,
      restaurantName: place.name, // Assuming place has a 'name' field
      date,
      guests,
      seatingPreference,
    });
    await booking.save();

    // Return the successful response
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
};
