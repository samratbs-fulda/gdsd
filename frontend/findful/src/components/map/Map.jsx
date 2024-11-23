import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './Map.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'

const Map = () => {
    const positionUni = [50.565187, 9.686583];
    return (
        <MapContainer center={positionUni} zoom={13} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={positionUni}>
                <Popup>
                    University of Applied Science Fulda
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map;