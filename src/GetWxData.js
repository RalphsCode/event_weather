import React, { useState, useEffect } from 'react';
import axios from 'axios';
import processADay from './processADay';

const GetWxData = () => {
    const [loading, setLoading] = useState(true);
    const [wxData, setWxData] = useState([]);
    
    // Get data from localStorage properly
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Get data from localStorage 
                const datesArr = JSON.parse(localStorage.getItem("datesArr")) || ['2023-06-01', '2022-06-01', '2021-06-01'];
                const FIPS = localStorage.getItem('FIPS') || '';

                const dataPromises = [];
                
                // Loop through all years that need to be searched
                for (let i = 0; i < datesArr.length; i++) {
                    try {
                        // Create promise for each API call
                        const promise = axios.get(`http://localhost:3001/api/noaa?date=${datesArr[i]}&FIPS=${FIPS}`);
                        dataPromises.push(promise);
                    } catch (err) {
                        console.log("Error creating request for year", datesArr[i], ":", err);
                    }
                }
                
                // Wait for all promises to resolve
                const responses = await Promise.all(dataPromises);
                
                // Extract data from responses
                const weatherData = responses.map(response => response.data);
                setWxData(weatherData);
                setLoading(false);
            } catch (err) {
                console.log("Error fetching weather data:", err);
                setLoading(false);
            }
        };
        
        fetchWeatherData();
    }, []); // Execute on mount
    
    if (loading) {
        return <p>Searching for weather history/data at the location...</p>;
    }
    
    return (
        <div className="weather-container">
            <h2>Weather Data Results</h2>
            {wxData.length > 0 ? (
                <div className="weather-results">
                    <p>Weather data retrieved for {wxData.length} date(s)</p>
                    
                    {wxData.map((yearData, index) => (
                        <div key={index} className="year-data">
                            <h3>Weather for {yearData.date}</h3>
                            {/* Display the data from each year */}
                            <div className="weather-details">
                                {Object.entries(yearData)
                                    .filter(([key]) => key !== 'date') // Skip the date field we added
                                    .map(([key, value]) => (
                                        <div key={key} className="weather-item">
                                            <strong>{key}:</strong> {
                                                typeof value === 'object' 
                                                    ? JSON.stringify(value) 
                                                    : value
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No weather data found for the selected dates.</p>
            )}
        </div>
    );
};

export default GetWxData;