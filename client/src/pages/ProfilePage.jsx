

import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import IndexPage from "./Index";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav"; // Import the extracted component

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [ready, setReady] = useState(false);
  const [redirect, setRedirect] = useState(null);
  let { subpage } = useParams(); // Access subpage parameter

  // Set default subpage to 'profile'
  if (subpage === undefined) {
    subpage = "profile";
  }

  useEffect(() => {
    // Set ready state to true when the component mounts
    setReady(true);
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  // If user context is not ready, render loading message
  if (!ready) {
    return "Loading...";
  }

  // Check if user exists and has a name property before accessing it
  if (!user || (!user.name && !redirect)) {
    return <Navigate to="/login" />; // Redirect to login page if user is not authenticated
  }

  // Dynamic styling for active/inactive links
  function linkClasses(type) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full";
    if (type === subpage) {
      classes += " bg-red-500 text-white ";
    } else {
      classes += " bg-gray-200 text-gray-700";
    }
    return classes;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      {redirect && <IndexPage />}
      {/* Render the extracted AccountNav component */}
      <AccountNav subpage={subpage} linkClasses={linkClasses} />

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}

      {subpage === "places" && <PlacesPage />}
    </div>
  );
}
