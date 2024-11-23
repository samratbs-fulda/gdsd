import React, { useState } from 'react';
import { sendSearchRequest } from '../services/searchService';
import './Homepage.css';
import Header from '../components/header/Header';
import Map from '../components/map/Map';

const Homepage = () => {
    const [searchText, setSearchText] = useState('');
    const [apartmentType, setApartmentType] = useState('1-room apartment');

    const searchApartment = async () => {
        try {
            const response = await sendSearchRequest(searchText, apartmentType);
            console.log('Search Response:', response);
        } catch (error) {
            console.error('Error during search:', error);
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
                    value={apartmentType}
                    onChange={(e) => setApartmentType(e.target.value)}
                >
                    <option value="1-room apartment">1-room apartment</option>
                    <option value="shared apartment">Shared apartment</option>
                    <option value="sublet">Sublet</option>
                </select>
                <button onClick={searchApartment}>Search</button>
            </div>

            <Map />
        </div>
    );
};

export default Homepage
