import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API endpoints:
//  Google maps
//  fcc - FIPS
//  ncdc/noaa

const API_ENDPOINTS = [
  "https://maps.googleapis.com/maps/api/place/textsearch/json?query={address}&key={g_key}",
  "https://geo.fcc.gov/api/census/block/find?format=json&latitude={lat}&longitude={long}&showall=true",
  "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&startdate={date}&enddate={date}&datatypeid=PRCP,TAVG&units=standard&limit=1000&locationid=FIPS:{fips}&includeStationLocation=True" 
];

function DataFetchingComponent() {
  // State to track loading and data for each API call
  const [loadingStages, setLoadingStages] = useState(
    API_ENDPOINTS.map(() => ({ loading: false, data: null, error: null }))
  );
  
  // State to track overall loading status
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  useEffect(() => {
    // Function to fetch data sequentially
    const fetchDataSequentially = async () => {
      try {
        // Create a copy of the current loading stages
        const updatedLoadingStages = [...loadingStages];

        // Iterate through endpoints sequentially
        for (let i = 0; i < API_ENDPOINTS.length; i++) {
          // Update loading state for current endpoint
          updatedLoadingStages[i] = { 
            ...updatedLoadingStages[i], 
            loading: true 
          };
          setLoadingStages(updatedLoadingStages);

          // Perform API call
          const response = await axios.get(API_ENDPOINTS[i]);

          // Update loading stages with fetched data
          updatedLoadingStages[i] = {
            loading: false,
            data: response.data,
            error: null
          };
          setLoadingStages(updatedLoadingStages);

          // Optional: Add a small delay between calls if needed
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Mark as fully loaded
        setIsFullyLoaded(true);
      } catch (error) {
        // Handle any errors during the sequential fetch
        const updatedLoadingStages = loadingStages.map((stage, index) => ({
          ...stage,
          loading: false,
          error: error.message
        }));
        setLoadingStages(updatedLoadingStages);
      }
    };

    // Initiate sequential data fetching
    fetchDataSequentially();
  }, []); // Empty dependency array means this runs once on component mount

  // Render loading spinner or progress
  const renderLoadingProgress = () => {
    return (
      <div className="loading-container">
        <h2>Loading Data...</h2>
        {loadingStages.map((stage, index) => (
          <div key={index} className="loading-stage">
            <span>Endpoint {index + 1}: </span>
            {stage.loading ? (
              <span className="loading">Loading...</span>
            ) : stage.error ? (
              <span className="error">Error: {stage.error}</span>
            ) : (
              <span className="completed">Completed ✓</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render data or loading state
  return (
    <div>
      {!isFullyLoaded ? (
        renderLoadingProgress()
      ) : (
        <div>
          <h1>All Data Loaded Successfully!</h1>
          {loadingStages.map((stage, index) => (
            <div key={index}>
              <h2>Data from Endpoint {index + 1}:</h2>
              <pre>{JSON.stringify(stage.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DataFetchingComponent;