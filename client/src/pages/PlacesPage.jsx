

import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PlaceManagement from "./PlaceManagement";
import AccountNav from "../AccountNav";
import axios from "axios";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const { action, id } = useParams(); // Destructure `id` from useParams for individual place actions
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Fetch places from the server
  const fetchPlaces = () => {
    axios
      .get("/places", { withCredentials: true })
      .then(({ data }) => {
        setPlaces(data.places);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  };

  const handleDeletePlace = (placeId) => {
    axios
      .delete(`/places/${placeId}`, { withCredentials: true })
      .then(() => {
        setPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== placeId));
      })
      .catch((error) => console.error("Error deleting place:", error));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navigation for Account */}
      <AccountNav subpage="places" />

      {/* Add New Place Button */}
      {action !== "new" && (
        <div className="text-center mb-6">
          <Link to="/account/places/new">
            <button className="flex items-center justify-center bg-red-500 text-white py-2 px-6 rounded-full shadow hover:shadow-lg transition-shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New Place
            </button>
          </Link>
        </div>
      )}

      {/* Add New Place Form */}
      {action === "new" ? (
        <PlacesFormPage onPlaceAdded={fetchPlaces} />
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.length > 0 ? (
            places.map((place) => (
              <div
                key={place._id}
                className="border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                onClick={() => navigate(`/account/places/${place._id}`)}
              >
                {/* Thumbnail */}
                {place.photos.length > 0 && (
                  <img
                    src={`http://localhost:4000/uploads/${place.photos[0]}`}
                    alt={place.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Details */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{place.title}</h2>
                  <p className="text-gray-500">{place.address}</p>
                  <p className="mt-2 text-gray-700 line-clamp-2">{place.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/account/places/${place._id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlace(place._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No places found.</p>
          )}
        </div>
      )}
    </div>
  );
}
