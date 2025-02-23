import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import './Map.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'
import React, { useEffect, useState } from 'react'
import { Polygon } from 'react-leaflet';
import axios from 'axios'
import { Button, Col, Row, Select, Slider, Spin, Switch } from 'antd'
import { getEnvironment } from '../../utils/fetchEnvironment'
import Paragraph from 'antd/es/typography/Paragraph'
import * as turf from "@turf/turf";
import { createListingMarker, getLandmarkIcon, getUniversityIcon } from '../../services/map/mapService'

const Map = ({ longitude, latitude, distanceFromUni, title }) => {
    const [activeUniNavigation, setActiveUniNavigation] = useState(false);
    const [activeShowLocations, setActiveShowLocations] = useState(false);

    const [route, setRoute] = useState(null);
    const [isRouteToUniversity, setIsRouteToUniversity] = useState(false);
    const [travelTime, setTravelTime] = useState(10);
    const [fetchingLandmarks, setFetchingLandmarks] = useState(false);
    const [landmark, setLandmark] = useState("supermarket");
    const [isochrone, setIsochrone] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [landmarkForRoute, setLandmarkForRoute] = useState(null);

    const position = [latitude, longitude];
    const positionUni = [50.5655095, 9.68737421159636];

    // Marker for listing position
    const listingMarker = createListingMarker();

    const environment = getEnvironment();
    const ors_key = environment.ORS_KEY;

    // Handle change of switch to navigate to university
    function navigationToUniChanged(checked) {
        if (checked) {
            // Display route to Uni
            setRoute(null);
            setActiveUniNavigation(true);
            setActiveShowLocations(false);
            setIsRouteToUniversity(true);
            setLandmarks([]);
            fetchRoute(position, positionUni);
        } else {
            // Hide route to Uni
            setActiveUniNavigation(false);
            setRoute(null);
        }
    }

    // Handle change of switch to show locations in walking distance
    function showLocationsChanged(checked) {
        if (checked) {
            setActiveShowLocations(true);
            setActiveUniNavigation(false);
            setRoute(null);
        } else {
            setActiveShowLocations(false);
            setLandmarks([]);
        }
    }


    // Fetch route from listing position to university or landmark
    const fetchRoute = async (start, end) => {
        const orsUrl = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${ors_key}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

        try {
            const orsResponse = await fetch(orsUrl);
            const orsData = await orsResponse.json();

            if (orsData.features[0]) {
                setRoute({
                    coordinates: orsData.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]),
                    duration: Math.round(orsData.features[0].properties.summary.duration / 60),
                    distance: Math.round(orsData.features[0].properties.summary.distance / 1000)
                });
            }
        } catch (error) {
            console.error("Error calculating route:", error);
        }
    };

    // Calculate travel times for isochrones
    function calculateTravelTimes() {
        let travelTimes = [];
        for (let i = 5; i <= travelTime; i += 5) {
            travelTimes.push(i * 60);
        }
        return travelTimes;
    }

    // Get color for isochrones according to travel distance
    const getIsochroneColors = (minutes) => {
        if (minutes <= 5) return { fillColor: "blue", color: "blue" };
        if (minutes <= 10) return { fillColor: "green", color: "green" };
        if (minutes <= 15) return { fillColor: "yellow", color: "yellow" };
        if (minutes <= 20) return { fillColor: "orange", color: "orange" };
        if (minutes <= 25) return { fillColor: "red", color: "red" };
        return { fillColor: "darkred", color: "darkred" };
    };

    // Fetch isochrones for walking distance (all polygons for the travel times)
    const fetchIsochrones = async () => {
        try {
            const response = await axios.post(
                "https://api.openrouteservice.org/v2/isochrones/foot-walking",
                {
                    locations: [[position[1], position[0]]],
                    range: calculateTravelTimes(),
                },
                {
                    headers: { Authorization: `Bearer ${ors_key}` },
                }
            );

            const polygons = response.data.features.map((feature, index) => ({
                coordinates: feature.geometry.coordinates[0],
                color: getIsochroneColors((index + 1) * 5),
            }));
            
            // Add colored zones to polygons
            addZonesToPolygons(polygons);

            // Add landmarks in walking distance
            fetchLandmarks(polygons);
        } catch (error) {
            console.error("Error fetching isochrones:", error);
        }
    };


    // Fetch landmarks in walking distance
    const fetchLandmarks = async (allPolygons) => {
        setLandmarks([]);
        if (!allPolygons || allPolygons.length === 0) return;

        setFetchingLandmarks(true)
        
        let landmarkType;
        switch (landmark) {
            case "supermarket":
            case "bakery":
                landmarkType = 'shop';
                break;
            case "pharmacy":
            case "restaurant":
                landmarkType = 'amenity';
                break;
            case "stop_position":
                landmarkType = 'public_transport';
        }

        const polygon = allPolygons[allPolygons.length - 1].coordinates
        // @ts-ignore
        const osmPolygon = `poly:"${polygon
            .map(([lon, lat]) => `${lat} ${lon}`)
            .join(" ")}"`;


        const overpassQuery = `
            [out:json];
            (
                node["${landmarkType}"="${landmark}"](${osmPolygon});
                way["${landmarkType}"="${landmark}"](${osmPolygon});
                relation["${landmarkType}"="${landmark}"](${osmPolygon});
            );
            out center;
        `;

        try {
            // Fetch all landmarks inside polygon
            const response = await axios.get(
                `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
            );
            const landmarkData = response.data.elements.map((element) => ({
                id: element.id,
                name: element.tags.name || `Unknown ${landmark}`,
                lat: element.center?.lat ?? element.lat,
                lon: element.center?.lon ?? element.lon,
            }));

            setLandmarks(landmarkData);
            setFetchingLandmarks(false);
        } catch (error) {
            console.error("Error fetching supermarkets:", error);
        }
    };

    // Add colored (non-overlapping) zones to polygons
    function addZonesToPolygons(polygons) {
        const updatedPolygons = polygons.map((isochrone, index) => {
            if (index == 0) {
                // Most inner Polygon stays the same
                return {
                    coordinates: [isochrone.coordinates],
                    color: isochrone.color,
                };
            } else {
                // Cut out inner polygons from outer polygon
                const inner = turf.polygon([polygons[index - 1].coordinates]);
                const outer = turf.polygon([isochrone.coordinates]);
                const difference = turf.difference(turf.featureCollection([outer, inner]));
                if (difference) {
                    return {
                        coordinates: difference.geometry.coordinates,
                        color: isochrone.color,
                    };
                }
            }
        });

        setIsochrone(updatedPolygons);
    }

    // Show route to selected landmark
    const showRouteToLandmark = (landmarkValue) => {
        const landmarkPosition = [landmarkValue.lat, landmarkValue.lon];
        setLandmarks([]);
        setLandmarkForRoute(landmarkValue);
        setIsRouteToUniversity(false);
        fetchRoute(position, landmarkPosition);
    };

    // Fetch landmarks and zones if switch is activated, landmark type is changed or travel time is changed
    useEffect(() => {
        if (activeShowLocations) {
            setLandmarks([]);
            setRoute(null);
            fetchIsochrones();
        }
    }, [activeShowLocations, travelTime, landmark]);

    return (
        <div>
            <MapContainer
                // @ts-ignore
                center={position} zoom={14} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                <Marker
                    // @ts-ignore
                    position={position} icon={listingMarker} eventHandlers={{ mouseover: (e) => e.target.openPopup() }}>
                    <Popup>{title}</Popup>
                </Marker>


                {/* Route to university */}
                {route && isRouteToUniversity && (
                    <>
                        <Polyline positions={route.coordinates} color="blue" />
                        <Marker
                            // @ts-ignore
                            position={positionUni} icon={getUniversityIcon()} eventHandlers={{ mouseover: (e) => e.target.openPopup() }}>
                            <Popup><Paragraph>Fulda University of Applied Science</Paragraph>By foot: {route.duration}min ({distanceFromUni}km)</Popup>
                        </Marker>
                    </>
                )}

                {/* Walking distance */}
                {isochrone.length > 0 && activeShowLocations && isochrone.map((zone, index) => {
                    if (zone.coordinates && zone.coordinates.length > 0) {
                        const coordinates = zone.coordinates.map(ring => ring.map(([lon, lat]) => [lat, lon]));
                        return (
                            <Polygon
                                key={index}
                                positions={coordinates}
                                pathOptions={{
                                    fillColor: zone.color.fillColor,
                                    fillOpacity: 0.15,
                                    color: zone.color.color,
                                    weight: 0.5
                                }}
                            />
                        );
                    }
                    return null;
                })}

                {/* Landmarks in walking distance */}
                {landmarks.map((landmarkValue) => (
                    <Marker key={landmarkValue.id} position={[landmarkValue.lat, landmarkValue.lon]} icon={getLandmarkIcon(landmark)} eventHandlers={{ mouseover: (e) => e.target.openPopup() }}>
                        <Popup>
                            <Paragraph>{landmarkValue.name}</Paragraph>
                            <Button onClick={() => showRouteToLandmark(landmarkValue)}>Show Navigation</Button>
                        </Popup>
                    </Marker>
                ))}

                {/* Route to landmark */}
                {route && !isRouteToUniversity && (
                    <>
                        <Polyline positions={route.coordinates} color="blue" />
                        <Marker
                            // @ts-ignore
                            position={route.coordinates[route.coordinates.length - 1]} icon={getLandmarkIcon(landmark)} eventHandlers={{ mouseover: (e) => e.target.openPopup() }}>
                            <Popup>
                                <Paragraph>{landmarkForRoute.name}</Paragraph>
                                By foot: {route.duration}min ({route.distance}km)
                            </Popup>
                        </Marker>
                    </>
                )}
            </MapContainer>


            {/* Map interaction */}
            <Row style={{ marginTop: "1em" }} align={'middle'}>
                <Col span={24} xl={12}>
                    <Row align={'middle'} style={{ width: "100%" }}>
                            <Switch checked={activeUniNavigation} onChange={navigationToUniChanged} />
                            <Paragraph style={{ marginBottom: 0, paddingLeft: "0.5em" }}>Show navigation to Fulda University of Applied Science</Paragraph>
                    </Row>
                </Col>
                <Col span={24} xl={12}>
                    <Row justify={'start'} align={'middle'} style={{ width: "100%" }}>
                        <Switch checked={activeShowLocations} onChange={showLocationsChanged} />
                        <Paragraph style={{ marginBottom: 0, paddingLeft: "0.5em", paddingRight: "0.5em" }}>Show all</Paragraph>
                        <Select
                            onChange={setLandmark}
                            disabled={!activeShowLocations}
                            defaultValue={"supermarket"}
                            options={[
                                { value: "supermarket", label: "Supermarkets" },
                                { value: "stop_position", label: "Public Transport" },
                                { value: "restaurant", label: "Restaurants" },
                                { value: "bakery", label: "Bakeries" },
                                { value: "pharmacy", label: "Pharmacy" },
                            ]}
                        />
                        <Paragraph style={{ marginBottom: 0, paddingLeft: "0.5em", paddingRight: "0.5em" }}>reachable in</Paragraph>
                        <Slider
                            disabled={!activeShowLocations}
                            min={5}
                            max={60}
                            defaultValue={15}
                            step={5}
                            value={travelTime}
                            onChange={setTravelTime}
                            style={{ width: "10%" }}
                        />
                        <Paragraph style={{ marginBottom: 0, paddingLeft: "0.5em", paddingRight: "0.5em" }}>min by foot</Paragraph>
                        {fetchingLandmarks && <Spin />}
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Map;