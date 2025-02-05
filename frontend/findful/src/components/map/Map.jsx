import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './Map.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'
import React from 'react'

const Map = ({longitude, latitude}) => {
    const position = [latitude, longitude];
    return (
        <MapContainer center={position} zoom={13} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    University of Applied Science Fulda
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map;