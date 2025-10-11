import { useState } from "react";
import axios from "axios";

export default function PhotoUploader() {
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");

  const backendURL = "http://localhost:4000"; // Change this to your backend URL if different.

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    if (!photoLink) {
      alert("Please enter a valid photo link.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendURL}/api/upload-by-link`, { link: photoLink });
      setAddedPhotos((prevPhotos) => [...prevPhotos, { url: data.imageUrl, type: "link" }]);
      setPhotoLink(""); // Clear the input field
    } catch (error) {
      console.error("Error adding photo by link:", error);
      alert("Failed to add photo by link. Please check the URL and try again.");
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    if (!files.length) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("photos", file));

    axios
      .post(`${backendURL}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data } = response;
        setAddedPhotos((prevPhotos) => [
          ...prevPhotos,
          ...data.map((filename) => ({ url: filename, type: "file" })),
        ]);
      })
      .catch((error) => {
        console.error("Error uploading photos:", error);
        alert("Photo upload failed. Please try again.");
      });
  }

  return (
    <>
      {/* Input for adding photo by link */}
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          placeholder="Add using link... (e.g., https://example.com/image.jpg)"
          className="p-2 border rounded-lg w-full"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300"
        >
          Add Photo
        </button>
      </div>

      {/* Display added photos */}
      <div className="mt-4 grid gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((item, index) => (
            <div className="relative" key={index}>
              <img
                src={item.type === "link" ? item.url : `${backendURL}/uploads/${item.url}`}
                alt={`Uploaded ${index}`}
                className="rounded-lg w-full h-36 object-cover"
              />
            </div>
          ))}
      </div>

      {/* Input for uploading photos */}
      <label
        className="mt-4 flex flex-col items-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 gap-2 cursor-pointer hover:bg-gray-200"
      >
        <input type="file" className="hidden" multiple onChange={uploadPhoto} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
          />
        </svg>
        Upload
      </label>
    </>
  );
}
    