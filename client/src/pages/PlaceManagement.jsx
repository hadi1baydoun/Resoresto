import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import axios from "axios";
import './PlaceManagement.css'; // Import your CSS file

export default function PlaceManagement({ place }) {
  const [mode, setMode] = useState(null); // 'view', 'edit', or 'delete'
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Track the current photo index for carousel
  const navigate = useNavigate();
  const { id } = useParams(); // Get the place ID from the URL parameters

  const handleView = () => {
    navigate(`/account/places/${place._id}`);
  };

  const handleEdit = () => {
    setMode("edit");
  };
  

  const handleDelete = async () => {
    try {
      await axios.delete(`/places/${place._id}`, { withCredentials: true });
      alert("Place deleted successfully");
      navigate("/account/places");
    } catch (error) {
      console.error("Error deleting place:", error);
      alert("Failed to delete place.");
    }
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % place.photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      (prevIndex - 1 + place.photos.length) % place.photos.length
    );
  };
  

  if (mode === "view") {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="view-container">  {/* Apply the class here */}
          <h3 className="text-lg font-semibold">{place.title}</h3>
          <p>{place.address}</p>
          {/* Carousel */}
          <div className="relative w-full h-auto">
            <img
              src={`http://localhost:4000/uploads/${place.photos[currentPhotoIndex]}`}
              alt={`${place.title} - Photo ${currentPhotoIndex + 1}`}
              className="w-full h-auto object-cover"
            />
            <button onClick={handlePrevPhoto} className="absolute left-0 bg-gray-200 p-2">
              ◀
            </button>
            <button onClick={handleNextPhoto} className="absolute right-0 bg-gray-200 p-2">
              ▶
            </button>
          </div>
          <button onClick={() => setMode(null)} className="mt-2 bg-gray-200 py-1 px-4 rounded-full">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (mode === "edit") {
    return <PlacesFormPage placeData={place} onSave={() => setMode(null)} />;
  }
  

  // Default mode (e.g., render buttons or other UI)
  return (
    <div className="flex gap-4">
    {/* View Button */}
    <button
        onClick={handleView}
        style={{
            backgroundColor: '#38a169', // Green
            color: 'white',
            padding: '8px 16px',
            borderRadius: '0.375rem',
            transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2f855a'} // Dark Green on hover
        onMouseLeave={(e) => e.target.style.backgroundColor = '#38a169'} // Reset color
    >
        View
    </button>

    {/* Delete Button */}
    <button
        onClick={handleDelete}
        style={{
            backgroundColor: '#e53e3e', // Red
            color: 'white',
            padding: '8px 16px',
            borderRadius: '0.375rem',
            transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#c53030'} // Dark Red on hover
        onMouseLeave={(e) => e.target.style.backgroundColor = '#e53e3e'} // Reset color
    >
        Delete
    </button>
</div>
);
  
}
