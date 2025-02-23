import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { divIcon } from 'leaflet';
import React from 'react';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { getEnvironment } from '../../utils/fetchEnvironment';
import axios from 'axios';

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

library.add(fas)

export const createListingMarker = () => {
  return divIcon({
    className: "custom-div-icon",
    html: ReactDOMServer.renderToString(
      <span className="fa-layers fa-fw" style={{ width: "100%", height: "100%" }}>
        <FontAwesomeIcon icon={["fas", "location-dot"]} color="black" transform="grow-40" />
      </span>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  })
};

// Create a marker icon with an icon inside a location pin
export const createMarkerIcon = (iconName) => {
  return divIcon({
    className: "custom-div-icon",
    html: ReactDOMServer.renderToString(
      <span className="fa-layers fa-fw" style={{ width: "100%", height: "100%" }}>
        <FontAwesomeIcon icon={["fas", "location-pin"]} color="black" transform="grow-30" />
        <FontAwesomeIcon icon={["fas", iconName]} color="white" transform="grow-3 up-4" />
      </span>
    ),
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
};

export const universityIcon = createMarkerIcon("graduation-cap");
export const supermarketIcon = createMarkerIcon("shopping-cart");
export const publicTransportIcon = createMarkerIcon("bus");
export const bakeryIcon = createMarkerIcon("bread-slice");
export const pharmacyIcon = createMarkerIcon("prescription-bottle-alt");
export const restaurantIcon = createMarkerIcon("utensils");

export const getLandmarkIcon = (landmark) => {
  switch (landmark) {
    case "supermarket":
      return supermarketIcon;
    case "bakery":
      return bakeryIcon;
    case "pharmacy":
      return pharmacyIcon;
    case "restaurant":
      return restaurantIcon;
    case "stop_position":
      return publicTransportIcon;
  }
}

export const getUniversityIcon = () => {
  return universityIcon;
}


export const getRoute = async (start, end) => {
  try {
    const response = await axios.post(`${apiUrl}/api/listings/route`, {start, end});
    return response.data.route;
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    throw error;
  }
};

export const getIsochrones = async (locations, range) => {
  try {
    const isochrones = await axios.post(`${apiUrl}/api/listings/isochrones`, {locations, range});
    return isochrones.data.isochrones;
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    throw error;
  }
};