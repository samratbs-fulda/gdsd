import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './Map.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'
import React from 'react'
import L from 'leaflet';
import markerIcon from '../../../public/marker-icon-2x.png';
import shadowMarkerIcon from '../../../public/marker-shadow.png';

const Map = ({longitude, latitude}) => {
    const position = [latitude, longitude];

    const customMarker = new L.Icon({
        iconUrl: markerIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: shadowMarkerIcon,
        shadowSize: [41, 41]
    });

    return (
        <MapContainer center={position} zoom={13} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customMarker}>
            </Marker>
        </MapContainer>
    )
}

export default Map;