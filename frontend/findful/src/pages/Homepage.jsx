import React from "react";
import { useState } from "react";
import { searchListing } from "../services/listingService";
import "./Homepage.css";
import { Input, Select, Button, Row, Col, Card, Form, Slider } from "antd";
import Meta from "antd/es/card/Meta";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const Homepage = () => {
  const [filters, setFilters] = useState({
    searchText: "",
    listingType: "All",
    minPrice: 0,
    maxPrice: 1500,
    size: [0, 200],
    rooms: [1, 20],
    amenities: [],
    maxDistance: 10.0,
  });

  const listingsQuery = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => {
      return searchListing(filters);
    },
  });

  const listings = listingsQuery.data || [];

  return (
    <div className="homepage">
      <div className="content">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col
            xs={24}
            sm={8}
            md={6}
            lg={5}
            className="filters-box"
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            <h3>Filters</h3>
            <Form
              layout="vertical"
              onFinish={(values) => {
                setFilters({
                  ...filters,
                  listingType: values.listingType || "all",
                  minPrice: values.minPrice || 0,
                  maxPrice: values.maxPrice || 1500,
                  size: values.size || [0, 200],
                  rooms: values.rooms || [1, 10],
                  amenities: values.amenities || [],
                  maxDistance: values.maxDistance || 10.0,
                });
              }}
            >
              <Form.Item
                name="listingType"
                label="Apartment Type"
                initialValue="All"
              >
                <Select
                  options={[
                    {
                      value: "All",
                      label: "All",
                    },
                    {
                      value: "SINGLE",
                      label: "Single-room apartment",
                    },
                    { value: "SHARED", label: "Shared apartment" },
                    { value: "SUBLET", label: "Sublet" },
                  ]}
                />
              </Form.Item>

              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item name="minPrice" label="Price Range">
                    <Input type="number" min={0} placeholder="Min" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="maxPrice" label=" " colon={false}>
                    <Input type="number" min={0} placeholder="Max" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="size" label="Size (sq.m)">
                <Slider range defaultValue={[0, 200]} max={200} />
              </Form.Item>

              <Form.Item name="rooms" label="Rooms">
                <Slider range defaultValue={[1, 10]} min={1} max={10} />
              </Form.Item>

              <Form.Item name="amenities" label="Amenities">
                <Select
                  mode="multiple"
                  options={[
                    { value: "kitchenFitted", label: "Fitted Kitchen" },
                    { value: "parkingAvailable", label: "Parking" },
                    { value: "petsAllowed", label: "Pets Allowed" },
                    { value: "smokingAllowed", label: "Smoking Allowed" },
                    { value: "balconyAvailable", label: "Balcony" },
                    { value: "gardenAvailable", label: "Garden" },
                    { value: "wifiAvailable", label: "Wi-Fi" },
                    { value: "tvCableIncluded", label: "Cable" },
                    { value: "storageAvailable", label: "Store Room" },
                    { value: "washingMachineAvailable", label: "Washing Machine" },
                    { value: "dishWasherAvailable", label: "Dish Washer" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="maxDistance"
                label="Max Distance from University (km)"
              >
                <Input type="number" step={0.1} min={0} placeholder="e.g 2.0" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Apply Filters
              </Button>
            </Form>
          </Col>

          <Col xs={24} sm={16} md={18} lg={19}>
            <Form
              className="search-bar"
              onFinish={(values) => {
                setFilters({
                  ...filters,
                  searchText: values.searchText || "",
                });
              }}
              style={{ marginBottom: 32 }}
            >
              <Row gutter={8} align="middle">
                <Col flex="auto">
                  <Form.Item name="searchText" style={{ marginBottom: 0 }}>
                    <Input type="text" placeholder="Enter address" />
                  </Form.Item>
                </Col>
                <Col flex="none">
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>

            <h2>Listings</h2>
            <Row gutter={16}>
              {listings.map((listing) => (
                <Col
                  span={24}
                  sm={12}
                  md={8}
                  key={listing.id}
                  style={{ marginBottom: 16 }}
                >
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
                        <Button key="view-details" type="primary" href={"listing/" + listing.id}>
                          View Details
                        </Button>,
                    ]}
                  >
                    <Meta title={listing.title} description={listing.type} />
                    <p>Rent: ${listing.warmRent}</p>
                    <p>Size: {listing.size} sq.m</p>
                    <p>Rooms Available: {listing.freeRooms}</p>
                    <p>Address: {listing.street} {listing.houseNumber}, {listing.postalCode}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Homepage;
