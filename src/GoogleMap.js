import React, { useState, useEffect, useRef } from 'react';

const GoogleMap = ({ lat, lng, title = "Location" }) => {
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  // Use useRef for a stable ID that doesn't change between renders
  const mapIdRef = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize the map when component mounts
  useEffect(() => {
    // Function to load Google Maps script
    const loadGoogleMapsScript = () => {
      const googleKey = process.env.REACT_APP_GOOGLE_KEY;
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      window.document.body.appendChild(googleMapScript);
      
      googleMapScript.addEventListener('load', () => {
        setMapLoaded(true);
      });
    };

    // Load the script if it's not already loaded
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      setMapLoaded(true);
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []); // Empty dependency array - only run on mount and unmount

  // Initialize map once the Google Maps script is loaded
  useEffect(() => {
    if (mapLoaded && !map) {
      // Default to center of USA if no coords provided
      const center = { lat: 39.8283, lng: -98.5795 };
    //   const center = lat && lng 
    //     ? { lat: parseFloat(lat), lng: parseFloat(lng) } 
    //     : { lat: 39.8283, lng: -98.5795 };
      
      const newMap = new window.google.maps.Map(document.getElementById(mapIdRef.current), {
        center,
        // zoom: lat && lng ? 4 : 6, // Zoom in if we have coordinates
        zoom: 3, // Zoom in if we have coordinates
      });
      
      setMap(newMap);
    }
  }, [mapLoaded, lat, lng, map]); // Only when these values change

  // Update the marker when lat/lng or map changes
  useEffect(() => {
    if (map && lat && lng) {
      const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
      
      // Remove previous marker if exists
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      
      // Add a marker for the coordinates
      const newMarker = new window.google.maps.Marker({
        map,
        position,
        animation: window.google.maps.Animation.DROP,
        title
      });
      
      markerRef.current = newMarker;
      
      // Center the map on the marker
    //   map.setCenter(position);
    }
  }, [map, lat, lng, title]); // Only when these values change

  return (
    <div style={{ width: '50%', height: '300px' }}>
      <div id={mapIdRef.current} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default GoogleMap;