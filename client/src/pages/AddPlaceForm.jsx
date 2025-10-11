import React, { useState } from "react";
import axios from "axios";

const AddPlaceForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    addedPhotos: [],
    description: "",
    perks: [],
    extraInfo: "",
    openHours: 0,
    closeHours: 0,
    numbPers: 0,
    tables: 0, // Add tables field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/places", formData, {
        withCredentials: true,
      });
      console.log("Place added successfully", response.data);
      // Optionally redirect or reset form here
    } catch (error) {
      console.error("Error adding place", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Perks (comma separated)</label>
        <input
          type="text"
          name="perks"
          value={formData.perks.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              perks: e.target.value.split(", ").map((perk) => perk.trim()),
            })
          }
        />
      </div>
      <div>
        <label>Extra Info</label>
        <input
          type="text"
          name="extraInfo"
          value={formData.extraInfo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Open Hours</label>
        <input
          type="number"
          name="openHours"
          value={formData.openHours}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Close Hours</label>
        <input
          type="number"
          name="closeHours"
          value={formData.closeHours}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Number of People</label>
        <input
          type="number"
          name="numbPers"
          value={formData.numbPers}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Number of Tables</label>
        <input
          type="number"
          name="tables"
          value={formData.tables}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type="submit">Add Place</button>
      </div>
    </form>
  );
};

export default AddPlaceForm;
