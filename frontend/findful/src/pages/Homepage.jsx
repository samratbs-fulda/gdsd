import React from "react";
import { useState } from "react";
import { getAllListings, searchListing } from "../services/listingService";
import "./Homepage.css";
import FHeader from "../components/header/Header";
import Map from "../components/map/Map";
import { Input, Select, Button, Row, Col, Card, Form } from "antd";
import Meta from "antd/es/card/Meta";
import { useQuery } from "@tanstack/react-query";

const Homepage = () => {
  const [searchText, setSearchText] = useState("");
  const [listingType, setListingType] = useState("all");

  const listingsQuery = useQuery({
    queryKey: ["listings", { searchText, listingType }],
    queryFn: () => {
      if (!searchText && listingType === "all") {
        return getAllListings();
      }
      return searchListing(searchText, listingType);
    },
  });

  const listings = listingsQuery.data || [];

  return (
    <div className="homepage">
      <FHeader />

      <div className="content">
        <h1>Search for Apartments</h1>
        <Form
          className="search-form"
          onFinish={(values) => {
            setSearchText(values.searchText);
            setListingType(values.listingType);
          }}
        >
          <Form.Item name="searchText">
            <Input type="text" placeholder="Search your location" />
          </Form.Item>
          <Form.Item name="listingType" initialValue="all">
            <Select
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
          </Form.Item>

          <Button htmlType="submit">Search</Button>
        </Form>

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
