import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import LocationForm from "./LocationForm";
import locationList from "./LocationList";
import { Link } from "react-router-dom";


const getColor = (severity) => {
  if (severity === "High") return "red";
  if (severity === "Medium") return "orange";
  return "green";
};

const CrimeMap = function () {
  const [crimes, setCrimes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userLocation, setUserLocation] = useState([6.9271, 79.8612]); // Default to Colombo

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => console.error("Error getting location:", error),
        { timeout: 10000 }
      );
    }

    // Fetch crime data
    axios
      .get("http://localhost:3000/api/crimes")
      .then((response) => setCrimes(response.data))
      .catch((error) => console.error("Error fetching crime data:", error));
  }, []);

  return (
    <div className="w-[90vw] mx-auto p-2 rounded-1xl shadow-lg bg-gray-800 m-2 relative z-10">
      <MapContainer
        center={userLocation}
        zoom={12}
        className="w-full h-[500px] rounded-1xl overflow-hidden relative z-[0]"
      >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {crimes.map((crime, index) => (
          <CircleMarker
            key={index}
            center={[crime.latitude, crime.longitude]}
            radius={8}
            color={getColor(crime.severity)}
          >
            <Popup>
              <strong>Type:</strong> {crime.type} <br />
              <strong>Severity:</strong> {crime.severity} <br />
              <strong>Date:</strong> {new Date(crime.date).toLocaleDateString()}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="relative flex justify-end p-5 z-0">
        <Link to="/locationList"><button className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded mr-5">Location List</button></Link>
        <button className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowForm(true)}>New Location</button>
      </div>

      {/* Show the location form when button is clicked */}
      {showForm && <LocationForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default CrimeMap;
