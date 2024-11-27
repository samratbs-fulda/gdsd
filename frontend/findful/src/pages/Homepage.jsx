import { useEffect, useState } from "react";
import { getAllListings, searchListing } from "../services/listingService";
import "./Homepage.css";
import Header from "../components/header/Header";
import Map from "../components/map/Map";
import { Input, Select, Button, Row, Col, Card } from "antd";
import React from "react";
import Meta from "antd/es/card/Meta";

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

      <div className="content">
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
              { value: "all", label: <span>All</span> },
              {
                value: "single apartment",
                label: <span>Single-room apartment</span>,
              },
              {
                value: "shared apartment",
                label: <span>Shared apartment</span>,
              },
              { value: "sublet", label: <span>Sublet</span> },
            ]}
          />
          <Button onClick={getFilteredLisitings}>Search</Button>
        </div>

        {/* SHOW ALL LISTINGS FROM db */}
        <div className="listings">
          <h2>Listings</h2>

          <Row gutter={16}>
            {listings.map((listing) => (
              <Col span={8} key={listing.id} style={{ marginBottom: 16 }}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="listing"
                      src={listing.img}
                      className="listing-image"
                    />
                  }
                  actions={[
                    <Button key="view-details" type="primary">
                      View Details
                    </Button>,
                  ]}
                >
                  <Meta
                    title={listing.name}
                    description={listing.apartment_type}
                  />
                  <p>Rent: ${listing.rent}</p>
                  <p>Postcode: {listing.postcode}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Map />
      </div>
    </div>
  );
};

export default Homepage;
