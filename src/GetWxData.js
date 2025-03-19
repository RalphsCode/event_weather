import React, { useState, useEffect } from 'react';
import axios from 'axios';
import processADay from './processADay';

const GetWxData = () => {
    const [loading, setLoading] = useState(true);
    const [wxData, setWxData] = useState([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [requestStatuses, setRequestStatuses] = useState({});
    
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Get data from localStorage 
                const datesArr = JSON.parse(localStorage.getItem("datesArr")) || ['2023-06-01', '2022-06-01', '2021-06-01'];
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
                        [date]: "loading"
                    }));
                    
                    try {
                        // Make the API request and await the response
                        const response = await axios.get(`http://localhost:3001/api/noaa?date=${date}&FIPS=${FIPS}`);
                        
                        // Make sure we have data before processing
                        if (response && response.data) {
                            console.log(`Records received for ${date}:`, response.data.length);
                            
                            // Process the data
                            const processedResult = processADay(date, response.data);
                            console.log(`Processed result for ${date}:`, processedResult);
                            
                            // Add to results array
                            allResults.push(processedResult);
                            
                            // Update status to "complete"
                            setRequestStatuses(prev => ({
                                ...prev,
                                [date]: `\u2713 complete - ${response.data.length} weather history data points found.`
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
                    console.log("All processed results:", allResults);
                    setWxData(allResults);
                } else {
                    console.error("No weather data was successfully processed");
                }
                
            } catch (err) {
                console.error("Error in overall fetch process:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);     // Execute at mount
    
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
                                            status === 'complete' ? '#d4edda' :
                                            status === 'loading' ? '#cce5ff' :
                                            status === 'error' ? '#f8d7da' : '#e2e3e5',
                                        color:
                                            status === 'complete' ? '#155724' :
                                            status === 'loading' ? '#004085' :
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
            {wxData.map((result, index) => {
            // If result is an object, display it
                if (result && typeof result === 'object') {
                    return (
                        <div key={index} className="weather-result">
                            {Object.entries(result).map(([key, value]) => (
                                <div key={key}>
                                    <strong>{key}:</strong> {JSON.stringify(value)}
                                </div>
                            ))}
                        </div>
                    );
                }   // END if statement

                })} 
        </div>
    );
};

export default GetWxData;