import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import processAnnuals from './processAnnuals';

const ResultsPage = () => {
    const [weatherResults, setWeatherResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve the stored results
        const storedResults = localStorage.getItem('weatherResults');
        
        if (storedResults) {
            try {
                const parsedResults = JSON.parse(storedResults);
                setWeatherResults(parsedResults);
                processAnnuals(parsedResults);
            } catch (err) {
                console.error("Error parsing stored weather results:", err);
            }
        }
        
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

    return (
        <div className="results-container">
            <h1>Weather Analysis Results</h1>
            {/* Map over the result array elements (day summaries) */}
            {weatherResults.map((result, index) => (
                <div key={index} className="result-card">
                    
                    <div className="result-grid">
                        {/* Map over the day summary element */}
                        {Object.entries(result).map(([key, value]) => {
                            // Skip the date property as it's already displayed as the title
                            if (key === 'date') return null;
                            
                            return (
                                <div key={key} className="result-item">
                                    <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                    {typeof value === 'object' ? (
                                        <pre>{JSON.stringify(value, null, 2)}</pre>
                                    ) : (
                                        <p>{value}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}     {/* END weatherResults.map */}
            
            <div className="actions">
                <Link to="/" className="btn btn-primary">New Search</Link>
            </div>
            
            <style jsx>{`
                .results-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .result-card {
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    margin-bottom: 30px;
                    padding: 20px;
                }
                
                .date-title {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                .result-item {
                    background-color: #f9f9f9;
                    border-radius: 6px;
                    padding: 15px;
                }
                
                .result-item h3 {
                    font-size: 16px;
                    margin-top: 0;
                    color: #555;
                    text-transform: capitalize;
                }
                
                pre {
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-radius: 4px;
                    overflow: auto;
                    font-size: 14px;
                }
                
                .actions {
                    margin-top: 30px;
                    text-align: center;
                }
                
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4285f4;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                
                .btn:hover {
                    background-color: #3367d6;
                }
                
                .no-results {
                    text-align: center;
                    padding: 40px;
                }
            `}</style>
        </div>
    );
};

export default ResultsPage;