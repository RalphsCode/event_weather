/** Presents the Prediction to the user.
 * UseEffect to retrieve the summarized yearly weather results for each year.
 * Process the summarized yearly results into a single prediction (processAnnuals function).
 * Send search & wx data to the database (postData function).
 * Display the weather prediction & weather from previous years.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import processAnnuals from './processAnnuals';
import { postData } from './postData';

const ResultsPage = () => {
    const [weatherResults, setWeatherResults] = useState([]);
    const [expectation, setExpectation] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve the summarized yearly weather results for each year
        // And send search & wx data to the database

        const storedResults = localStorage.getItem('weatherResults');
        
        if (storedResults) {
            try {
                const parsedResults = JSON.parse(storedResults);
                // Set weatherResults in useState to be the summarized yearly weather results
                setWeatherResults(parsedResults);

                // Process the summarized yearly results into a single prediction
                const dailyExpectation = processAnnuals(parsedResults);

                setExpectation(dailyExpectation);
                localStorage.setItem('prediction', JSON.stringify(dailyExpectation));
            } catch (err) {
                console.error("Error parsing stored weather results:", err);
            }
        }   // END if...
        
        setLoading(false);

        // Send search and wx data to database after component renders.
        const submitData = async () => {
            try {
                const result = await postData();    // Function that sends data via API to DB
                console.log("Data submitted successfully:", result);
            } catch (error) {
                console.error("Failed to submit data:", error);
            }
        };
    
        // Timeout to ensure everything is loaded before sending data
        const timer = setTimeout(() => {
            submitData();
        }, 200);
    
    return () => clearTimeout(timer);

    }, []);     // END UseEffect

    // Display Loading as needed
    if (loading) {
        return <div>Loading results...</div>;
    }

    // If there are no weather results, snd brief message
    if (!weatherResults || weatherResults.length === 0) {
        return (
            <div className="no-results">
                <h2>No Weather Data Available</h2>
                <p>No weather data was found. Please try searching again.</p>
                <Link to="/" className="btn btn-primary">Back to Search</Link>
            </div>
        );
    }

    // Pull the details from localstorage
    const solunar = JSON.parse(localStorage.getItem('solunar'));
    const locationObj = JSON.parse(localStorage.getItem('locationData'));
    const eventLocation = locationObj.location;

    const shortDate = localStorage.getItem('eventDate');
    const monthNum = shortDate.slice(5,7);
    const dayNum = shortDate.slice(8, 10);

    const monthNames = {
        "01":"January",
        "02":"February",
        "03":"March",
        "04":"April",
        "05":"May",
        "06":"June",
        "07":"July",
        "08":"August",
        "09":"September",
        "10":"October",
        "11":"November",
        "12":"December"
    }


    // Display the weather prediction & weather from previous years
    return (
        <div>
        <div>
            <Link to="/" className="btn btn-primary">New Search</Link>
        </div>

        <h1>On {monthNames[monthNum]} {dayNum} in {eventLocation} expect:</h1>
        <div>
            <h3>Temperature: <b>{expectation.expectedTemp}° F</b></h3>
            <h3><b>{expectation.rainPercent}%</b> Chance of precipitation.
            </h3>
            
            <p>The lowest temp I found there on this day was: {expectation.expectedTMIN}° F</p>
            <p>The highest temp I found there on this day was: {expectation.expectedTMAX}° F</p>

            <p>Sunrise: {solunar.sunrise}<br/>Sunset:&nbsp; {solunar.sunset}</p>
        </div>

        <div>
            <h3>Previous years in {eventLocation} on {monthNames[monthNum]} {dayNum}:</h3>
            <table>
            <thead>
                <tr>
                <th>Date</th>
                <th>Temperature</th>
                <th>Precipitation?</th>
                <th>Highest Temp</th>
                <th>Lowest Temp</th>
                </tr>
            </thead>
            <tbody>
                {weatherResults.map((result) => 
                Object.entries(result).map(([date, data]) => (
                    <tr key={date}>
                    <td>{date}</td>
                    <td>{data.temp !== null ? `${data.temp}° F` : 'N/A'}</td>
                    <td>{data.rain ? 'Yes' : 'No'}</td>
                    <td>{data.maxTemp !== null ? `${data.maxTemp}° F` : 'N/A'}</td>
                    <td>{data.minTemp !== null ? `${data.minTemp}° F` : 'N/A'}</td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    );  // END return
};  // END RestulsPage

export default ResultsPage;