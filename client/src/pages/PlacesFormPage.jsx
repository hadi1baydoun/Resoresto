import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import { useEffect, useState } from "react";
import axios from "axios";
import PhotoUploader from "../PhotoUploader";
import AccountNav from "../AccountNav";

export default function PlacesFormPage({ onPlaceAdded }) {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track admin access
  const [adminCodeInput, setAdminCodeInput] = useState(""); // Input for admin code

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [closeHours, setCloseHours] = useState('');
  const [numbPers, setNumbPers] = useState(1); // Default to 1
  const [tables, setTables] = useState(1); // Default table count to 1
  const [redirect, setRedirect] = useState(false);

  // Admin authentication logic
  const handleAdminAccess = () => {
    if (adminCodeInput === "0000") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin code.");
    }
  };

  useEffect(() => {
    if (!id) return;
    axios.get('/places/' + id)
      .then(response => {
        const { data } = response;
        setTitle(data.title || '');
        setAddress(data.address || '');
        setAddedPhotos(data.addedPhotos || []);
        setDescription(data.description || '');
        setPerks(data.perks || []);
        setExtraInfo(data.extraInfo || "");
        setOpenHours(data.openHours || "");
        setCloseHours(data.closeHours || "");
        setNumbPers(data.numbPers || 1);
        setTables(data.tables || 1); // Load table count if available
      })
      .catch(error => console.error("Error fetching place data:", error));
  }, [id]);

  async function addNewPlace(ev) {
    ev.preventDefault();
    await axios.post('/places', {
      title, address, addedPhotos, description, perks, extraInfo, openHours, closeHours, numbPers, tables
    });
    setRedirect(true);
    if (onPlaceAdded) onPlaceAdded(); // Refresh the list
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Admin Access Required</h2>
        <input
          type="password"
          placeholder="Enter Admin Code"
          value={adminCodeInput}
          onChange={(e) => setAdminCodeInput(e.target.value)}
          className="border rounded-lg p-2 mt-4"
        />
        <button
          onClick={handleAdminAccess}
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={addNewPlace}>
        <h2 className="text-2xl mt-4 font-semibold">Title</h2>
        <p className="text-gray-500 text-sm">Give your place a short and catchy title</p>
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title" />

        <h2 className="text-2xl mt-4 font-semibold">Address</h2>
        <p className="text-gray-500 text-sm">Location of your place</p>
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address" />

        <h2 className="text-2xl mt-4 font-semibold">Photos</h2>
        <p className="text-gray-500 text-sm">Upload photos of your place</p>
        <PhotoUploader addedPhotos={addedPhotos} onPhotosChange={setAddedPhotos} />

        <h2 className="text-2xl mt-4 font-semibold">Description</h2>
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Describe your place" />

        <h2 className="text-2xl mt-4 font-semibold">Perks</h2>
        <Perks selected={perks} onChange={setPerks} />

        <h2 className="text-2xl mt-4 font-semibold">Extra Info</h2>
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} placeholder="Additional information" />

        <div>
          <h3>Opening Hours</h3>
          <input type="text" value={openHours} onChange={ev => setOpenHours(ev.target.value)} placeholder="Opening hours" />
        </div>
        <div>
          <h3>Closing Hours</h3>
          <input type="text" value={closeHours} onChange={ev => setCloseHours(ev.target.value)} placeholder="Closing hours" />
        </div>

        <div>
          <h3>Number of Tables</h3>
          <input
            type="number"
            value={tables}
            min="1"
            onChange={ev => setTables(ev.target.value)}
            placeholder="Enter number of tables"
          />
        </div>

        <div>
          <button className="primary my-3">Save</button>
        </div>
      </form>
    </div>
  );
}
