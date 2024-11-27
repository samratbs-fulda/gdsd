import { useEffect, useState } from "react";
import { getAllListings, searchListing } from "../services/listingService";
import "./Homepage.css";
import Header from "../components/header/Header";
import Map from "../components/map/Map";
import { Input, Select, Button } from "antd";
import React from "react";

const Homepage = () => {
    const [searchText, setSearchText] = useState("");
    const [listingType, setListingType] = useState("all");
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
            setListings(response);
            console.log("Search Response:", response);
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    return (
        <div className="homepage">
            <Header />

            <div className='content'>
                <h1>Search for Apartments</h1>
                <div className="search-form">
                    <Input
                        type="text"
                        placeholder="Search your location"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        value={listingType}
                        onChange={(value) => setListingType(value)}
                        options={[
                            { value: 'all', label: <span>All</span> },
                            { value: 'single apartment', label: <span>Single-room apartment</span> },
                            { value: 'shared apartment', label: <span>Shared apartment</span> },
                            { value: 'sublet', label: <span>Sublet</span> },
                        ]}
                    />
                    <Button onClick={getFilteredLisitings}>Search</Button>
                </div>

                {/* SHOW ALL LISTINGS FROM db */}
                <div className="listings">
                    <h2>Listings</h2>

                    <ul>
                        {listings?.map((listing) => (
                            <li key={listing.id}>
                                <h3>{listing.name}</h3>
                                <img src={listing.img} alt="image"/>
                                <p>{listing.apartment_type}</p>
                                <p>{listing.rent}</p>
                                <p>{listing.postcode}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <Map />
            </div>
        </div>
    );
};

export default Homepage;
