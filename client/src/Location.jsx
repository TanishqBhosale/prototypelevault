import React, { useState } from 'react';

function LocationFinder() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords.accuracy > 100) {
            setError('Location accuracy is low. Please try again or move to an open area.');
          } else {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
            setError(null);
            
          }
        },
        (err) => {
          console.log("Error from Geolocation API:", err);
          setError('Geolocation failed. Trying IP-based location...');
          getIPLocation(); // Call IP-based location as a fallback
        },
        { enableHighAccuracy: true }

      );
      
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // IP-based location fallback
  const getIPLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 'IP-based estimate',
      });
      setError(null);
    } catch (error) {
      setError('Unable to retrieve location from IP.');
    }
  };

  return (
    <div>
      <h2>Find My Location</h2>
      <button onClick={getLocation}>Get Location</button>
      {location.latitude && location.longitude ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy ? `${location.accuracy} meters` : 'Not available'}</p>
          <button onClick={() => window.location.replace(`https://www.latlong.net/c/?lat=${location.latitude}&long=${location.longitude}`)}>
      See Location on LatLong.net
    </button>
        </div>
      ) : (
        <p>{error ? error : 'Click the button to get your location.'}</p>
      )}
    </div>
  );
}

export default LocationFinder;
