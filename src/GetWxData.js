import React, { useState, useEffect } from 'react';
import axios from 'axios';
import processADay from './processADay';
import { useNavigate } from 'react-router-dom'; // Import for navigation

// A flag to track if the fetch has been initiated
let fetchHasStarted = false;

const GetWxData = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [requestStatuses, setRequestStatuses] = useState({});
    const navigate = useNavigate(); // For navigation
    
    useEffect(() => {
        const fetchWeatherData = async () => {
            // If we've already started fetching data, don't do it again
            if (fetchHasStarted) {
                console.log("Fetch already initiated, skipping duplicate fetch");
                return;
            }
            
            // Mark that we've started fetching
            fetchHasStarted = true;
            console.log("Starting weather data fetch - first time");
            
            try {
                // Get data from localStorage 
                const datesArr = JSON.parse(localStorage.getItem("datesArr")) || ['2023-06-01', '2022-06-01', '2021-06-01'];
                if (datesArr.length > 10) {
                    datesArr.length = 10;
                } else if (datesArr.length === 0){
                    console.log("The date array is invalid.");
                    throw new RangeError("The Date Array length is out of acceptable range");
                }
                const FIPS = localStorage.getItem('FIPS') || '';
                
                // Initialize progress tracking
                const initialStatuses = {};
                datesArr.forEach(date => {
                    initialStatuses[date] = "waiting";
                });
                setRequestStatuses(initialStatuses);
                setProgress({ current: 0, total: datesArr.length });
                
                // Array to collect all processed results
                const allResults = [];
                
                // Process each date sequentially
                for (let i = 0; i < datesArr.length; i++) {
                    const date = datesArr[i];
                    
                    // Update status to "loading" for current date
                    setRequestStatuses(prev => ({
                        ...prev,
                        [date]: "Searching"
                    }));
                    
                    try {
                        // Make the API request and await the response
                        console.log(`Making API request for date: ${date}`);
                        const response = await axios.get(`http://localhost:3001/api/noaa?date=${date}&FIPS=${FIPS}`);
                        
                        // Make sure we have data before processing
                        if (response && response.data) {
                            
                            // Process the data
                            const processedResult = processADay(date, response.data);
                            console.log(`Processed result for ${date}:`, processedResult);
                            
                            // Add to results array
                            allResults.push(processedResult);
                            
                            // Update status to "complete"
                            setRequestStatuses(prev => ({
                                ...prev,
                                [date]: `\u2713 complete. A total of ${response.data.length} weather history data points found.`
                            }));
                        } else {
                            console.error(`No data in response for ${date}`);
                            setRequestStatuses(prev => ({
                                ...prev,
                                [date]: "error"
                            }));
                        }
                    } catch (err) {
                        console.error(`Error retrieving data for date ${date}:`, err);
                        
                        // Update status to "error"
                        setRequestStatuses(prev => ({
                            ...prev,
                            [date]: "error"
                        }));
                    }
                    
                    // Update progress
                    setProgress(prev => ({
                        ...prev,
                        current: i + 1
                    }));
                }   // END for loop - one date completed
                
                // Check if we got any results
                if (allResults.length > 0) {
                    // Store the processed results in localStorage for access in the results page
                    localStorage.setItem('weatherResults', JSON.stringify(allResults));
                    
                    // Add a small delay before navigation to ensure UI updates
                    setTimeout(() => {
                        // Navigate to results page
                        navigate('/results');
                    }, 1000); // 1 second delay
                } else {
                    console.error("No weather data returned from the NCDC API call, or processADay function.");
                }
                
            } catch (err) {
                console.error("Error in overall NCDC API fetch process in GetWxData.js:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [navigate]); // Add navigate to dependencies
    
    if (loading) {
        return (
            <div>
                <p>Searching for weather history/data at the location...</p>
                {progress.total > 0 && (
                    <div>
                        <p>Progress: {progress.current} of {progress.total} dates processed</p>
                        <div style={{ 
                            width: '100%', 
                            backgroundColor: '#e0e0e0', 
                            borderRadius: '4px',
                            height: '20px',
                            marginBottom: '10px'
                        }}>
                            <div style={{ 
                                width: `${(progress.current / progress.total) * 100}%`,
                                height: '20px',
                                backgroundColor: '#4caf50',
                                borderRadius: '4px',
                                transition: 'width 0.3s'
                            }}/>
                        </div>
                        
                        <div style={{ marginTop: '10px' }}>
                            {Object.entries(requestStatuses).map(([date, status]) => (
                                <div key={date} style={{ display: 'flex', marginBottom: '5px', alignItems: 'center' }}>
                                    <span style={{ width: '120px' }}>{date}:</span>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: 
                                            status.includes('complete') ? '#d4edda' :
                                            status === 'Searching' ? '#cce5ff' :
                                            status === 'error' ? '#f8d7da' : '#e2e3e5',
                                        color:
                                            status.includes('complete') ? '#155724' :
                                            status === 'Searching' ? '#004085' :
                                            status === 'error' ? '#721c24' : '#383d41'
                                    }}>
                                        {status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="weather-container">
            <h2>Weather Data Results</h2>
            <p>All data has been loaded! Redirecting to results page...</p>
            {/* Progress indicator for redirect */}
            <div style={{ 
                width: '100%', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '4px',
                height: '10px',
                marginBottom: '20px'
            }}>
                <div style={{ 
                    width: '100%',
                    height: '10px',
                    backgroundColor: '#3f51b5',
                    borderRadius: '4px',
                    transition: 'width 1s',
                    animation: 'pulse 1s infinite'
                }}/>
            </div>
            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default GetWxData;