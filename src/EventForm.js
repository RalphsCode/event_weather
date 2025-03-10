import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function EventForm() {
    // useState to store the form data
    const [formData, setFormData] = useState({
        eventLocation: localStorage.getItem('eventLocation') || "San Diego, CA", 
        eventDate: localStorage.getItem('eventDate') || "2025-07-15",
        searchYears: localStorage.getItem('searchYears') || "3"
    });

        const navigate = useNavigate();

    // Handle Submit function - puts form data in local storage
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData.eventLocation, formData.eventDate, formData.searchYears);
        localStorage.setItem("eventLocation", formData.eventLocation);
        localStorage.setItem("eventDate", formData.eventDate);
        localStorage.setItem("searchYears", formData.searchYears);

        // Forward to the confirm inputs page:
        navigate('/confirm');

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
            
        </div>
    )   // END return

}   // END eventForm

export default EventForm;