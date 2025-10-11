// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function BookingsPage() {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get('/account/bookings', { withCredentials: true })
//       .then(response => {
//         console.log('Bookings response:', response.data);
//         setBookings(response.data);
//       })
//       .catch(error => {
//         setError('Error fetching bookings');
//         console.error('Error fetching bookings:', error);
//       });
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Your Reservations</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {bookings.length === 0 ? (
//         <p>You have no reservations yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {bookings.map((booking) => (
//             <li key={booking._id} className="bg-gray-100 p-4 rounded-lg shadow">
//               <h2 className="text-xl font-semibold">
//                 {booking.place?.title || 'Unknown Place'}
//               </h2>
//               <p>
//                 <strong>Date:</strong> {booking.date}
//               </p>
//               <p>
//                 <strong>Guests:</strong> {booking.guests}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/account/bookings', { withCredentials: true })
      .then(response => {
        console.log('Bookings response:', response.data);
        setBookings(response.data);
      })
      .catch(error => {
        setError('Error fetching bookings');
        console.error('Error fetching bookings:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Reservations</h1>
      {error && <p className="text-red-500">{error}</p>}
      {bookings.length === 0 ? (
        <p>You have no reservations yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">
                {booking.place?.title || 'Unknown Place'}
              </h3>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              <p>
                <strong>Seating Preference:</strong> {booking.seatingPreference}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
