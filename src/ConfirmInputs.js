// Page asking the user to confirm their inputs
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleMap from './GoogleMap';

const ConfirmInputs = () => {
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the entered location from localStorage 
                const location = localStorage.getItem('eventLocation');
                
                if (!location) {
                    throw new Error('Location data not found. Please go back and fill the form.');
                }
                
                // Fetch data from my API
                const response = await axios.get(`http://localhost:3001/api/google?input=${location}`);
                setLocationData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'An error occurred while fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Effect runs once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!locationData) return <p>No location data found.</p>;
    console.log("locationData.formattedAddress.toLowerCase():", locationData.formattedAddress.toLowerCase());
    if (!locationData.formattedAddress.toLowerCase().includes("usa") && !locationData.formattedAddress.toLowerCase().includes("united states") ) {
        return ( 
            <>
                <p>That location not found in the USA, please try again.</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </>
        )}

    return (
        <div>
            <h2>Confirm Your Event Details...</h2>
            <p>
                <b>Event Location:</b>{localStorage.getItem('eventLocation')}<br />
                <b>AKA:</b> {locationData.location}<br />
                <b>Address:</b> {locationData.formattedAddress}
            </p>
            <p>
                <b>Event Date:</b> {localStorage.getItem('eventDate')}<br />
                <b>Search Years:</b> {localStorage.getItem('searchYears')}
            </p>

            <button onClick={() => window.history.back()}>Edit</button>
            <button>Looks Good!</button>

            {/* Include the Google Maps component */}
            <div>
                <h2>Location Map</h2>
                <GoogleMap 
                    lat={locationData.lat} 
                    lng={locationData.lng} 
                    title={localStorage.getItem('eventLocation')} 
                />
            </div>

        </div>
    );
};

export default ConfirmInputs;