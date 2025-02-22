import React from "react";
import { useState, useEffect } from "react";
import { searchListing } from "../services/listingService";
import { Input, Select, Button, Row, Col, Card, Form, Slider, Drawer, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getSpecialCharacterValidationRule } from "../utils/inputValidation";
import "./Homepage.css";

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

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const resetFilters = () => {
    const newFilters = {
      searchText: "",
      listingType: "All",
      minPrice: 0,
      maxPrice: 1500,
      size: [0, 200],
      rooms: [1, 20],
      amenities: [],
      maxDistance: 10.0,
    };
    setFilters(newFilters);
    form.setFieldsValue(newFilters);
  };

  const listingsQuery = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => {
      return searchListing(filters);
    },
  });

  const listings = listingsQuery.data || [];

  const handleFormSubmit = (values) => {
    setFilters({
      ...filters,
      ...values,
      listingType: values.listingType || "All",
      minPrice: values.minPrice || 0,
      maxPrice: values.maxPrice || 1500,
      size: values.size || [0, 200],
      rooms: values.rooms || [1, 20],
      amenities: values.amenities || [],
      maxDistance: values.maxDistance || 10.0,
      searchText: values.searchText || "",
    });
    
    if (isMobile) {
      setIsFilterDrawerOpen(false);
    }
  };

  const FiltersContent = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={filters}
      onFinish={handleFormSubmit}
    >
      <Form.Item name="searchText" label="Search" hidden>
        <Input placeholder="Enter address or postal code" />
      </Form.Item>

      <Form.Item name="listingType" label="Apartment Type">
        <Select
          options={[
            { value: "All", label: "All" },
            { value: "SINGLE", label: "Single-room apartment" },
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
        <Slider range max={200} />
      </Form.Item>

      <Form.Item name="rooms" label="Rooms">
        <Slider range min={1} max={10} />
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

      <Form.Item name="maxDistance" label="Max Distance from University (km)">
        <Input type="number" step={0.1} min={0} placeholder="e.g 2.0" />
      </Form.Item>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" htmlType="submit" block>
          Apply Filters
        </Button>
        <Button type="default" block onClick={resetFilters}>
          Remove Filters
        </Button>
      </Space>
    </Form>
  );

  return (
    <div className="homepage" style={{ padding: 16 }}>
      <div className="content">
        <Row gutter={16}>
          {/* Mobile Filters */}
          {isMobile && (
            <Col xs={24} style={{ marginBottom: 16 }}>
              <Button 
                type="default"
                icon={<MenuOutlined />}
                onClick={() => setIsFilterDrawerOpen(true)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                Filters
              </Button>
            </Col>
          )}

          {/* Desktop Filters */}
          {!isMobile && (
            <Col xs={24} sm={8} md={6} lg={5}>
              <div style={{ 
                border: '1px solid #f0f0f0', 
                padding: 16, 
                borderRadius: 8 
              }}>
                <h3>Filters</h3>
                <FiltersContent />
              </div>
            </Col>
          )}

          <Drawer
            title="Filters"
            placement="left"
            open={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            width={320}
          >
            <FiltersContent />
          </Drawer>

          <Col xs={24} sm={isMobile ? 24 : 16} md={isMobile ? 24 : 18} lg={isMobile ? 24 : 19}>
            {/* Search Bar */}
            <div style={{ marginBottom: 32 }}>
              <Row gutter={8} align="middle">
                <Col flex="auto">
                  <Form
                    form={form}
                    onFinish={handleFormSubmit}
                  >
                    <Form.Item
                      name="searchText"
                      style={{ marginBottom: 0 }}
                      rules={[getSpecialCharacterValidationRule("search")]}
                    >
                      <Input
                        placeholder="Enter address or postal code"
                        style={{
                          height: 40,
                          fontSize: 16,
                          padding: '0 20px',
                          border: '1px solid #d9d9d9'
                        }}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col flex="none">
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => form.submit()}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </div>

            <h2>Listings</h2>
            <Row gutter={[16, 16]}>
              {listings.map((listing) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  key={listing.id}
                >
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, overflow: 'hidden' }}>
                        <img
                          alt="listing"
                          src={listing.img}
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <Button
                        key="view-details"
                        type="primary"
                        href={`listing/${listing.id}`}
                      >
                        View Details
                      </Button>,
                    ]}
                  >
                    <Meta title={listing.title} description={listing.type} />
                    <div style={{ marginTop: 16 }}>
                      <p>Rent: {listing.warmRent}€</p>
                      <p>Size: {listing.size} sq.m</p>
                      <p>Rooms Available: {listing.freeRooms}</p>
                      <p>
                        Address: {listing.street} {listing.houseNumber},{" "}
                        {listing.postalCode}
                      </p>
                      <p>Distance from University: {listing.distanceFromUni} km</p>
                    </div>
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