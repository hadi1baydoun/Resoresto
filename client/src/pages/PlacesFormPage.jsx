
// import { Navigate, useParams } from "react-router-dom";
// import Perks from "../Perks";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import PhotoUploader from "../PhotoUploader";
// import AccountNav from "../AccountNav";

// export default function PlacesFormPage({ onPlaceAdded }) {
//   const { id } = useParams();
//   console.log("ID from URL:", id);

//   const [title, setTitle] = useState('');
//   const [address, setAddress] = useState('');
//   const [addedPhotos, setAddedPhotos] = useState([]);
//   const [description, setDescription] = useState('');
//   const [perks, setPerks] = useState([]);
//   const [extraInfo, setExtraInfo] = useState('');
//   const [openHours, setOpenHours] = useState('');
//   const [closeHours, setCloseHours] = useState('');
//   const [numbPers, setNumbPers] = useState(1);
//   const [redirect, setRedirect] = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     axios.get('/places/' + id)
//       .then(response => {
//         const { data } = response;
//         setTitle(data.title);
//         setAddress(data.address);
//         setAddedPhotos(data.addedPhotos);
//         setDescription(data.description);
//         setPerks(data.perks);
//         setExtraInfo(data.extraInfo);
//         setOpenHours(data.openHours);
//         setCloseHours(data.closeHours);
//         setNumbPers(data.numbPers);
//       })
//       .catch(error => console.error("Error fetching place data:", error));
//   }, [id]);

//   const linkClasses = (category) => 'inline-flex gap-2 py-2 px-6 rounded-full';

//   function renderInputHeader(text) {
//     return <h2 className="text-2xl mt-4 font-semibold">{text}</h2>;
//   }

//   function renderInputDescription(text) {
//     return <p className="text-gray-500 text-sm">{text}</p>;
//   }

//   async function addNewPlace(ev) {
//     ev.preventDefault();
//     await axios.post('/places', {
//       title, address, addedPhotos, description, perks, extraInfo, openHours, closeHours, numbPers
//     });
//     setRedirect(true);
//     if (onPlaceAdded) onPlaceAdded(); // Call the function to refresh the list
//   }

//   if (redirect) {
//     return <Navigate to={'/account/places'} />;
//   }

//   return (
//     <div>
//       <AccountNav linkClasses={linkClasses} />

//       <form onSubmit={addNewPlace}>
//         {renderInputHeader('Title')}
//         {renderInputDescription('Give your place a short and catchy title')}
//         <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, e.g., Cozy Apartment" />

//         {renderInputHeader('Address')}
//         {renderInputDescription('Location of your place')}
//         <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address" />

//         {renderInputHeader('Photos')}
//         {renderInputDescription('Upload photos of your place')}
//         <PhotoUploader addedPhotos={addedPhotos} onPhotosChange={setAddedPhotos} />

//         {renderInputHeader('Description')}
//         {renderInputDescription('Describe your place in detail')}
//         <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Describe your place" />

//         {renderInputHeader('Perks')}
//         {renderInputDescription('Select the perks your place offers')}
//         <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           <Perks selected={perks} onChange={setPerks} />
//         </div>

//         {renderInputHeader('Extra Info')}
//         {renderInputDescription('Additional information about your place')}
//         <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} placeholder="Additional information" />

//         {renderInputHeader('Open & Close Hours')}
//         <div className="grid gap-2 sm:grid-cols-3">
//           <div>
//             <h3 className="mt-2 -mb-1">Opening Hours</h3>
//             <input type="text" value={openHours} onChange={ev => setOpenHours(ev.target.value)} placeholder="e.g., 10 AM" />
//           </div>
//           <div>
//             <h3 className="mt-2 -mb-1">Closing Hours</h3>
//             <input type="text" value={closeHours} onChange={ev => setCloseHours(ev.target.value)} placeholder="e.g., 12 AM" />
//           </div>
//           <div>
//             <h3 className="mt-2 -mb-1">Min Number of Guests</h3>
//             <input type="number" value={numbPers} onChange={ev => setNumbPers(ev.target.value)} placeholder="e.g., 2 guests" />
//           </div>
//         </div>

//         <div>
//           <button className="primary my-3">Save</button>
//         </div>
//       </form>
//     </div>
//   );
// }


import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import { useEffect, useState } from "react";
import axios from "axios";
import PhotoUploader from "../PhotoUploader";
import AccountNav from "../AccountNav";

export default function PlacesFormPage({ onPlaceAdded }) {
  const { id } = useParams();
  console.log("ID from URL:", id);

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [closeHours, setCloseHours] = useState('');
  const [numbPers, setNumbPers] = useState(1); // Default to 1 instead of undefined
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get('/places/' + id)
      .then(response => {
        const { data } = response;
        setTitle(data.title || ''); // Fallback to an empty string
        setAddress(data.address || ''); // Ensure a string is always set
        setAddedPhotos(data.addedPhotos || []); // Default to an empty array
        setDescription(data.description || '');
        setPerks(data.perks || []);
        setExtraInfo(data.extraInfo || '');
        setOpenHours(data.openHours || '');
        setCloseHours(data.closeHours || '');
        setNumbPers(data.numbPers || 1); // Default to 1
      })
      .catch(error => console.error("Error fetching place data:", error));
  }, [id]);

  const linkClasses = (category) => 'inline-flex gap-2 py-2 px-6 rounded-full';

  function renderInputHeader(text) {
    return <h2 className="text-2xl mt-4 font-semibold">{text}</h2>;
  }

  function renderInputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  async function addNewPlace(ev) {
    ev.preventDefault();
    await axios.post('/places', {
      title, address, addedPhotos, description, perks, extraInfo, openHours, closeHours, numbPers
    });
    setRedirect(true);
    if (onPlaceAdded) onPlaceAdded(); // Call the function to refresh the list
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  return (
    <div>
      <AccountNav linkClasses={linkClasses} />

      <form onSubmit={addNewPlace}>
        {renderInputHeader('Title')}
        {renderInputDescription('Give your place a short and catchy title')}
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, e.g., Cozy Apartment" />

        {renderInputHeader('Address')}
        {renderInputDescription('Location of your place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address" />

        {renderInputHeader('Photos')}
        {renderInputDescription('Upload photos of your place')}
        <PhotoUploader addedPhotos={addedPhotos} onPhotosChange={setAddedPhotos} />

        {renderInputHeader('Description')}
        {renderInputDescription('Describe your place in detail')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Describe your place" />

        {renderInputHeader('Perks')}
        {renderInputDescription('Select the perks your place offers')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {renderInputHeader('Extra Info')}
        {renderInputDescription('Additional information about your place')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} placeholder="Additional information" />

        {renderInputHeader('Open & Close Hours')}
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-1">Opening Hours</h3>
            <input type="text" value={openHours} onChange={ev => setOpenHours(ev.target.value)} placeholder="e.g., 10 AM" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Closing Hours</h3>
            <input type="text" value={closeHours} onChange={ev => setCloseHours(ev.target.value)} placeholder="e.g., 12 AM" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Min Number of Guests</h3>
            <input type="number" value={numbPers} onChange={ev => setNumbPers(ev.target.value || 1)} placeholder="e.g., 2 guests" />
          </div>
        </div>

        <div>
          <button className="primary my-3">Save</button>
        </div>
      </form>
    </div>
  );
}
