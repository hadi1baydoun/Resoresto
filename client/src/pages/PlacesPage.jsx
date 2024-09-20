
// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import PlacesFormPage from "./PlacesFormPage";
// import AccountNav from "../AccountNav";
// import axios from "axios";

// export default function PlacesPage() {
//   const [places, setPlaces] = useState([]);
//   const { action } = useParams();

//   useEffect(() => {
//     axios.get("/places").then(({ data }) => {
//       setPlaces(data); // Store the data in state
//     });
//   }, []);

//   const linkClasses = (type, subpage) => {
//     return `inline-flex gap-2 py-2 px-6 rounded-full ${
//       type === subpage ? "bg-red-500 text-white" : "bg-gray-200"
//     }`;
//   };

//   return (
//     <div>
//       {/* Use AccountNav for the navigation */}
//       <AccountNav subpage="places" linkClasses={linkClasses} />

//       {/* Conditionally render the button based on the action */}
//       {action !== "new" && (
//         <div className="text-center mb-4">
//           <Link to="/account/places/new" className="inline-block">
//             <button className="flex items-center bg-red-500 text-white py-2 px-6 rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6 mr-2"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//               </svg>
//               Add new place
//             </button>
//           </Link>
//         </div>
//       )}

//       {/* Conditionally render the PlacesFormPage or list of places based on the action */}
//       {action === "new" ? (
//         <PlacesFormPage />
//       ) : (
//         <div className="mt-4">
//           {places.length > 0 ? (
//             places.map((place) => (
//               <Link to={`/account/places/${place._id}`} key={place._id} className="block">
//                 <div className="flex gap-4 bg-gray-200 p-4 rounded-2xl border border-gray-300 mb-4">
//                   <div className="w-32 h-32 bg-gray-300 flex items-center justify-center grow shrink-0">
//                     {place.photos.length > 0 ? (
//                       <img
//                         src={place.photos[0]}
//                         alt={place.title}
//                         className="w-full h-full object-cover rounded-md"
//                         onError={(e) => {
//                           e.target.src = "/path-to-default-image.png"; // Fallback image
//                         }}
//                       />
//                     ) : (
//                       <span className="text-gray-500">No Image</span>
//                     )}
//                   </div>
//                   <div className="grow-0 shrink">
//                     <h2 className="text-xl">{place.title}</h2>
//                     <p className="text-sm mt-2">{place.description}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <Link to="/account/places/new" className="block">
//               <p className="bg-gray-200 p-4 rounded-2xl mt-4 text-black-500">
//                 No places available. Click here to add a new place.
//               </p>
//             </Link>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import axios from "axios";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const { action } = useParams();
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Fetch places from the server
  const fetchPlaces = () => {
    axios.get("/places")
      .then(({ data }) => {
        setPlaces(data);
      })
      .catch(error => {
        console.error("Error fetching places:", error);
      });
  };

  // Function to handle refresh after adding a new place
  const handleAddNewPlace = () => {
    setButtonClicked(true);
    fetchPlaces();
  };

  const linkClasses = (type, subpage) => {
    return `inline-flex gap-2 py-2 px-6 rounded-full ${
      type === subpage ? "bg-red-500 text-white" : "bg-gray-200"
    }`;
  };

  return (
    <div>
      {/* Use AccountNav for the navigation */}
      <AccountNav subpage="places" linkClasses={linkClasses} />

      {/* Conditionally render the button based on the action */}
      {action !== "new" && (
        <div className="text-center mb-4">
          <Link to="/account/places/new" className="inline-block">
            <button
              className={`flex items-center bg-red-500 text-white py-2 px-6 rounded-full ${
                buttonClicked ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
              onClick={handleAddNewPlace}
            >
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
              Add new place
            </button>
          </Link>
        </div>
      )}

      {/* Conditionally render the PlacesFormPage or list of places based on the action */}
      {action === "new" ? (
        <PlacesFormPage onPlaceAdded={fetchPlaces} />
      ) : (
        <div className="mt-4">
          {places.length > 0 ? (
            places.map((place) => (
              <Link to={`/account/places/${place._id}`} key={place._id} className="block">
                <div className="flex gap-4 bg-gray-200 p-4 rounded-2xl border border-gray-300 mb-4">
                  <div className="w-32 h-32 bg-gray-300 flex items-center justify-center grow shrink-0">
                    {place.photos.length > 0 ? (
                      <img
                        src={place.photos[0]}
                        alt={place.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                  <div className="grow-0 shrink">
                    <h2 className="text-xl">{place.title}</h2>
                    <p className="text-sm mt-2">{place.description}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <Link to="/account/places/new" className="block">
              <p className="bg-gray-200 p-4 rounded-2xl mt-4 text-black-500">
                No places available. Click here to add a new place.
              </p>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
