import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import processAnnuals from './processAnnuals';

const ResultsPage = () => {
    const [weatherResults, setWeatherResults] = useState([]);
    const [expectation, setExpectation] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve the summarized yearly weather results for each year
        const storedResults = localStorage.getItem('weatherResults');
        
        if (storedResults) {
            try {
                const parsedResults = JSON.parse(storedResults);
                // Set weatherResults to be the summarized yearly weather results
                setWeatherResults(parsedResults);
                // Process the summarized yearly results into a single prediction
                const dailyExpectation = processAnnuals(parsedResults);
                // Check for any missing data (NaN)
                for (const key in dailyExpectation) {
                    if (isNaN(dailyExpectation[key]) || dailyExpectation[key] === null ) {
                      dailyExpectation[key] = "Unfortunatly, not enough weather data to make this prediction."; 
                    } } // END for loop...
                setExpectation(dailyExpectation);
            } catch (err) {
                console.error("Error parsing stored weather results:", err);
            }
        }   // END if...
        
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading results...</div>;
    }

    if (!weatherResults || weatherResults.length === 0) {
        return (
            <div className="no-results">
                <h2>No Weather Data Available</h2>
                <p>No weather data was found. Please try searching again.</p>
                <Link to="/" className="btn btn-primary">Back to Search</Link>
            </div>
        );
    }

    const solunar = JSON.parse(localStorage.getItem('solunar'));

    return (
        <div>
        <div>
            <Link to="/" className="btn btn-primary">New Search</Link>
        </div>

        <h1>Weather Analysis Results</h1>
        <div>
            <h3>
            Expect: <b>{expectation.rainPercent}%</b> Chance of precipitation (rain, etc),&nbsp;
            Temperature: <b>{expectation.expectedTemp}° F</b>
            </h3>
            <p>The lowest temp I found on this day was: {expectation.expectedTMIN}° F</p>
            <p>The highest temp I found on this day was: {expectation.expectedTMAX}° F</p>
            <p>Sunrise: {solunar.sunrise}<br/>Sunset:&nbsp; {solunar.sunset}</p>
        </div>

        <div>
            <h3>Previous Years:</h3>
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