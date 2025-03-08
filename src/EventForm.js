import React, {useState} from "react";
import axios from 'axios';

function EventForm() {
    // useState to store the form data
    const [formData, setFormData] = useState({eventLocation: "San Diego, CA", 
        eventDate: "2025-06-01", 
        searchYears: "3"});

    const [location, setLocation] = useState(null);

    // Handle Submit function - puts form data in local storage
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData.eventLocation, formData.eventDate, formData.searchYears);
        localStorage.setItem("eventLocation", formData.eventLocation);
        localStorage.setItem("eventDate", formData.eventDate);
        localStorage.setItem("searchYears", formData.searchYears);

        const locationStr = encodeURIComponent(formData.eventLocation);

        const response = await axios.get(`http://localhost:3001/api/google?input=${locationStr}`);
        
        setLocation(response.data);
    }

    // Handle user input in the form - update the form data useState
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData( prev => ({
            ...prev, [name]: value
        }))
    }

    // Present the form
    return (
        <div>
            <form onSubmit = {handleSubmit}>

                <label htmlFor="eventDate">Event Date: </label>
                <input type = "date"
                placeholder={formData.eventDate}
                value={formData.eventDate}
                name="eventDate"
                onChange = {handleChange} />
                <br />

                <label htmlFor="eventLocation">Event Location search term: </label>
                <input type = "text"
                placeholder="Event Location (USA only)"
                value={formData.eventLocation}
                name="eventLocation"
                onChange = {handleChange} />
                <br />

                <label htmlFor="searchYears">Number of past years to review: </label>
                <input type = "number"
                placeholder={formData.searchYears}
                value={formData.searchYears}
                name="searchYears"
                onChange = {handleChange} 
                min="1" max="10" step="1"/>

                <br />
                <button type="submit">Go!</button>

            </form>

            {location && (
                <p>
                    Location Data:<br />
                    {JSON.stringify(location)}
                </p>
            )}
        </div>
    )   // END return

}   // END eventForm

export default EventForm;