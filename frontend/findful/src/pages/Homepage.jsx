import { useEffect, useState } from "react";
import { getAllListings, searchListing } from "../services/listingService";
import "./Homepage.css";
import Header from "../components/header/Header";
import Map from "../components/map/Map";

const Homepage = () => {
  const [searchText, setSearchText] = useState("");
  const [listingType, setListingType] = useState("Single-room apartment");
  const [listings, setListings] = useState([]);

  // Fetch all listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getAllListings();

        // Call the getAllListings function
        setListings(data); // Set fetched listings to state
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings(); // Trigger the fetch
  }, []);

  const getFilteredLisitings = async () => {
    try {
      const response = await searchListing(searchText, listingType);
      console.log("Search Response:", response);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div className="homepage">
      <Header />

      <h1>Search for Apartments</h1>
      <div className="search-form">
        <input
          type="text"
          placeholder="Search your location"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
        >
          <option value="Single-room apartment">Single-room apartment</option>
          <option value="shared apartment">Shared apartment</option>
          <option value="sublet">Sublet</option>
        </select>
        <button onClick={getFilteredLisitings}>Search</button>
      </div>

      {/* SHOW ALL LISTINGS FROM db */}
      <div className="listings">
        <h2>Listings</h2>
        <ul>
          {listings.map((listing) => (
            <li key={listing.id}>
              <h3>{listing.name}</h3>
              <p>{listing.apartment_type}</p>
              <p>{listing.rent}</p>
              <p>{listing.postcode}</p>
            </li>
          ))}
        </ul>
      </div>

      <Map />
    </div>
  );
};

export default Homepage;
