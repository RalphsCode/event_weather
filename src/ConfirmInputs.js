// Page asking the user to confirm their inputs
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import FipsAPI from './FipsAPI';
import makeDates from './makeDates';

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

    // Do a useEffect to Call the FIPS API server
    useEffect(() =>{
        const fetchFIPS = async () => {
            try {
                const FIPS = await FipsAPI(locationData.lat, locationData.lng);
                localStorage.setItem("FIPS", FIPS);
            } catch (err) {
                console.log("Error trying to execute fetchFIPS:", err);
            }
        }   // END fetchFIPS()
        fetchFIPS();
    }, [locationData]);     // END useEffect


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!locationData) return <p>No location data found.</p>;
    if (!locationData.formattedAddress.toLowerCase().includes("usa") && !locationData.formattedAddress.toLowerCase().includes("united states") ) {
        return ( 
            <>
                <p>That location not found in the USA, please try again.</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </>
        )}

    localStorage.setItem("locationData", JSON.stringify(locationData));

    const eventDate = localStorage.getItem('eventDate');
    const searchYears = localStorage.getItem('searchYears');
    
    const datesArr = makeDates(eventDate, searchYears);

    console.log("datesArr:", datesArr);

    return (
        <div>
            <h2>Does this look right:</h2>
            <p>
                <b>Event Location:</b> {localStorage.getItem('eventLocation')}<br />
                <b>Address:</b> {locationData.formattedAddress}<br />
                <b>Event Date:</b> {localStorage.getItem('eventDate')}<br />
                <b>Search Years:</b> {localStorage.getItem('searchYears')}
            </p>

            <button onClick={() => window.history.back()}>Change</button>
            <button>Yep! Looks Good</button>

            {/* Include the Google Maps component */}
            <div>
                <h2>{locationData.location}</h2>
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