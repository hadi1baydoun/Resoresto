import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import axios from "axios";

export default function PlaceManagement({ place }) {
  const [mode, setMode] = useState(null); // 'view', 'edit', or 'delete'
  const navigate = useNavigate();
  const { id } = useParams(); // Get the place ID from the URL parameters

  const handleView = () => {
    setMode("view");
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/places/${id}`, { withCredentials: true });
      alert("Place deleted successfully");
      navigate("/account/places"); // Navigate back to the list
    } catch (error) {
      console.error("Error deleting place:", error);
      alert("Failed to delete place.");
    }
  };

  // Render based on the selected mode
  if (mode === "view") {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold">{place.title}</h3>
        <p>{place.address}</p>
        <img src={`http://localhost:4000/uploads/${place.photos[0]}`} alt={place.title} className="w-full h-auto" />
        <button onClick={() => setMode(null)} className="mt-2 bg-gray-200 py-1 px-4 rounded-full">Back</button>
      </div>
    );
  } else if (mode === "edit") {
    return <PlacesFormPage placeData={place} onSave={() => setMode(null)} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleView} className="bg-blue-500 text-white py-1 px-4 rounded-full">View</button>
      <button onClick={handleEdit} className="bg-yellow-500 text-white py-1 px-4 rounded-full">Edit</button>
      <button onClick={handleDelete} className="bg-red-500 text-white py-1 px-4 rounded-full">Delete</button>
    </div>
  );
}
