import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";

export default function Header() {
  const { user } = useContext(UserContext);
  const [searchInput, setSearchInput] = useState({
    location: "",
    date: "",
    guests: "",
  });
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (!searchInput.location || !searchInput.date || !searchInput.guests) {
      alert("Please fill out all fields before searching!");
      return;
    }
    console.log("Search Details:", searchInput);
    setIsSearchActive(false); // Close search bar after submission
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md sticky top-0 z-50">
      {/* Logo Section */}
      <Link to={"/"} className="flex items-center gap-1 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="font-semibold text-lg">Resoresto</span>
      </Link>

      {/* Search Bar */}
      <div
        className={`flex flex-col md:flex-row items-center border border-gray-300 rounded-full shadow-sm py-2 px-4 hover:shadow-md transition-shadow bg-white ${
          isSearchActive ? "w-full max-w-md" : "cursor-pointer"
        }`}
        onClick={() => setIsSearchActive(true)}
      >
        {isSearchActive ? (
          <form
            className="flex flex-col md:flex-row gap-2 md:gap-4 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="text"
              name="location"
              value={searchInput.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="flex-1 outline-none border-none bg-gray-100 rounded-md px-3 py-2 text-sm"
              required
            />
            <input
              type="date"
              name="date"
              value={searchInput.date}
              onChange={handleInputChange}
              className="flex-1 outline-none border-none bg-gray-100 rounded-md px-3 py-2 text-sm"
              required
            />
            <input
              type="number"
              name="guests"
              value={searchInput.guests}
              onChange={handleInputChange}
              placeholder="Guests"
              className="flex-1 outline-none border-none bg-gray-100 rounded-md px-3 py-2 text-sm"
              min="1"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-md text-sm"
            >
              Search
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="px-3 border-r border-gray-300 text-sm text-gray-600">
              Location
            </div>
            <div className="px-3 border-r border-gray-300 text-sm text-gray-600">
              Date
            </div>
            <div className="px-3 text-sm text-gray-600">Guests</div>
            <button className="ml-auto bg-primary text-white p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Account Bar */}
      <Link
        to={user ? "/account" : "/login"}
        className="flex items-center gap-3 border border-gray-300 rounded-full py-1 px-3 hover:shadow-md transition-shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden w-8 h-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {!!user && <div className="text-sm font-medium">{user.name}</div>}
      </Link>
    </header>
  );
}
