import React from "react";
import { useGeolocated } from "react-geolocated";

const LocationFinder = () => {
    
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  return isGeolocationAvailable ? (
    isGeolocationEnabled ? (
      coords ? (
        <div>
          <h1 style={{ color: "green" }}>GeeksForGeeks</h1>
          <h3 style={{ color: "red" }}>
            Current latitude and longitude of the user is:
          </h3>
          <ul>
            <li>Latitude: {coords.latitude}</li>
            <li>Longitude: {coords.longitude}</li>
          </ul>
          <button onClick={() => window.location.replace(`https://www.latlong.net/c/?lat=${coords.latitude}&long=${coords.longitude}`)}>
      See Location on LatLong.net
    </button>
        </div>
      ) : (
        <h1>Getting the location data...</h1>
      )
    ) : (
      <h1>Please enable location on your browser</h1>
    )
  ) : (
    <h1>Please update or change your browser</h1>
  );
};

export default LocationFinder;
