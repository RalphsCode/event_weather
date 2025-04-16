/** Page asking the user to confirm their inputs.
* User directed here from the EventForm Component / page.
* 1. UseEffect to find the location from Google Maps API
* 2. UseEffect to find solunar from API - Saved to local storage
* 3. UseEffect to get ZipRef data - Saved to local storage
* 4. Verify location - Save to local storage
* 5. Call function to build an array of dates to search
* 6. Display findings and ask user to verify. 
* 7. Display google map of USA
* 8. User goes back to EventForm or forward to GetWxData
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleMap from './GoogleMap';
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
                console.log("Just queried the Google API");
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

    // Do a useEffect to Call the sunrise/sunset API server
    useEffect(() =>{
        const fetchSunTime = async () => {
            try {
                // Only proceed if we have location data with coordinates
                if (!locationData || !locationData.lat || !locationData.lng) return;

                const eventDate = localStorage.getItem('eventDate');

                const response = await axios.get(`http://localhost:3001/api/solunar?lat=${locationData.lat}&lng=${locationData.lng}&date=${eventDate}`);
                const solunar = response.data;
                localStorage.setItem('solunar', JSON.stringify(solunar));
            } catch (err) {
                console.log("Error trying to execute sunrise/sunset API call:", err);
            }
        }   // END fetchSunTime()
        fetchSunTime();
    }, [locationData]);     // END useEffect

    // Do a useEffect to Call the ZipRef API server
    useEffect(() =>{
        const fetchZipRef = async () => {
            try {
                // Only proceed if we have location data with coordinates
                if (!locationData || !locationData.lat || !locationData.lng) return;

                const response = await axios.get(`http://localhost:3001/api/ZipRef?lat=${locationData.lat}&lng=${locationData.lng}`);
                const ZipRef = response.data;
                localStorage.setItem("ZipRef", ZipRef);
            } catch (err) {
                console.log("Error trying to execute fetch ZipRef API call:", err);
            }
        }   // END fetchZipRef()
        fetchZipRef();
    }, [locationData]);     // END useEffect


    // Check a location was found, its in the USA, then save to local storage
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!locationData) return <p>Ooops!! We could not find that location. please try again.</p>;
    if (!locationData.formattedAddress.toLowerCase().includes("usa") && !locationData.formattedAddress.toLowerCase().includes("united states") ) {
        return ( 
            <>
                <p>That location not found in the USA, please try again.</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </>
        )}
    // Save location data to local storage
    localStorage.setItem("locationData", JSON.stringify(locationData));

    // Call function to build an array of dates to search
    const eventDate = localStorage.getItem('eventDate');
    const searchYears = Number(localStorage.getItem('searchYears'));
    makeDates(eventDate, searchYears);

    // Display findings and ask user to verify. 
    // Also display google map of USA
    return (
        <div>
            <h2>Does this look right?</h2>
            <p>
                <b>You entered:</b> {localStorage.getItem('eventLocation')}<br />
                <b>I found:</b> {locationData.location}<br />
                <b>Address:</b> {locationData.formattedAddress}<br /><br />

                <button onClick={() => window.history.back()}>Change</button>
                &nbsp; &nbsp;
                <button onClick={() => window.location.href = "/wxData"}>Yep! Looks Good</button><br /><br />

                <b>Event Date:</b> {localStorage.getItem('eventDate')}<br />
                <b>Event:</b> {localStorage.getItem('eventType')}<br />
                <b>Search Years:</b> {localStorage.getItem('searchYears')}
            </p>



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