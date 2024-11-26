// Mouse.js
import React, { useState, useEffect } from 'react';

const MouseTracker = ({ onPathUpdate, stopTracking }) => {
  const [mousePath, setMousePath] = useState([]);
  const [tracking, setTracking] = useState(true); // Start tracking automatically

  const handleMouseMove = (event) => {
    if (tracking) {
      const newPoint = { x: event.clientX, y: event.clientY };
      setMousePath((prevPath) => {
        const updatedPath = [...prevPath, newPoint];
        onPathUpdate(updatedPath); // Update the parent with the new path
        return updatedPath;
      });
    }
  };

  useEffect(() => {
    if (tracking) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tracking]);

  useEffect(() => {
    if (stopTracking) {
      setTracking(false);
    }
  }, [stopTracking]);

  
};

export default MouseTracker;
