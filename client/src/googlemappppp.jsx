import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the current position of the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchLocation, handleError);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchLocation = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Constructing the URL for the Google Maps Geocoding API
    const apiKey = 'AIzaSyDbZ_gb__5Pv0wWn2M6ydCPU_p291hjyuQ';  // Replace with your API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

    // Make the API request to get location details
    axios
      .get(url)
      .then((response) => {
        if (response.data.status === 'OK') {
          setLocation(response.data.results[0].formatted_address);
        } else {
          setError('Unable to retrieve location data.');
        }
      })
      .catch(() => setError('Error fetching location data.'));
  };

  const handleError = (error) => {
    setError('Error retrieving geolocation.');
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {location ? <p>Current Location: {location}</p> : <p>Loading...</p>}
    </div>
  );  
};

export default CurrentLocation;
