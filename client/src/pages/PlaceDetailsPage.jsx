import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PlaceDetailsPage() {
  const { id } = useParams(); // Get the place ID from the URL
  const [place, setPlace] = useState(null);
  const [seatingPreference, setSeatingPreference] = useState(""); // State for seating preference
  const [feedback, setFeedback] = useState(""); // State for feedback
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/places/${id}`)
      .then(({ data }) => {
        setPlace(data);
      })
      .catch((error) => {
        console.error("Error fetching place details:", error);
        navigate("/account/places"); // Redirect if the place is not found
      });
  }, [id]);

  if (!place) {
    return <div>Loading...</div>;
  }

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    if (!seatingPreference) {
      alert("Please select your seating preference.");
      return;
    }

    // Collect reservation data
    const reservationData = {
      placeId: place._id,
      date: e.target.date.value,
      guests: e.target.guests.value,
      seatingPreference,
      feedback,
    };

    try {
      // Send reservation data to the backend
      const response = await axios.post("/reservations", reservationData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Reservation successful!");

        // Update available tables
        setPlace((prevPlace) => ({
          ...prevPlace,
          tables: Math.max(prevPlace.tables - 1, 0), // Ensure tables don't go below 0
        }));

        if (place.tables - 1 === 0) {
          alert("No more tables available. Please join the waiting list.");
        }

        navigate("/account/bookings");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const joinWaitlist = window.confirm(
          "No tables are available. Would you like to join the waiting list?"
        );
        if (joinWaitlist) {
          await handleWaitingList(e.target.date.value, e.target.guests.value);
        }
      } else {
        console.error("Error making reservation:", error);
        alert("Failed to make reservation. Please try again.");
      }
    }
  };

  const handleWaitingList = async (date, guests) => {
    const waitingListData = {
      placeId: place._id,
      date,
      guests,
      feedback,
    };

    try {
      await axios.post("/waiting-list", waitingListData, {
        withCredentials: true,
      });
      alert("You have been added to the waiting list. We will notify you if a table becomes available.");
    } catch (error) {
      console.error("Error adding to waiting list:", error);
      alert("Failed to join the waiting list. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{place.title}</h1>
      <p className="text-gray-600 mb-4">{place.address}</p>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">About this place</h2>
        <p className="text-gray-700">{place.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold">Details</h3>
          <p><strong>Minimum Guests:</strong> {place.numbPers}</p>
          <p><strong>Number of Tables:</strong> {place.tables}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Perks</h3>
          <ul>
            {place.perks.map((perk, index) => (
              <li key={index} className="list-disc ml-5">{perk}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Make a Reservation</h2>
        <form onSubmit={handleReservationSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              name="guests"
              min={place.numbPers}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Seating Preference</label>
            <div className="space-x-4">
              {["bar", "outdoor", "indoor", "kids", "smoking"].map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="seating"
                    value={option}
                    checked={seatingPreference === option}
                    onChange={(e) => setSeatingPreference(e.target.value)}
                    className="mr-2"
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              name="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Share your experience or preferences..."
              rows="4"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg ${
              place.tables > 0 ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"
            }`}
          >
            {place.tables > 0 ? "Reserve Now" : "Join Waiting List"}
          </button>
        </form>
      </div>

      <div className="mt-6 p-4 bg-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold">Reservation Rules</h2>
        <p className="text-gray-700 mt-2">
          1. Underage customers can't sit near the bar. <br />
          2. Customers can only reserve one restaurant at a time. <br />
          3. Multiple reservations allowed if times don't overlap. <br />
          4. Full name and email required. <br />
          5. Arrive within 15 minutes of the reservation.
        </p>
      </div>

      <button
        className="mt-6 bg-gray-500 text-white py-2 px-4 rounded"
        onClick={() => navigate("/account/places")}
      >
        Back to List
      </button>
    </div>
  );
}
 