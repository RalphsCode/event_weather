import React, {useState} from "react";

function EventForm() {

    const [formData, setFormData] = useState({eventLocation: "San Diego, CA", eventDate: "2025-06-01", searchYears: "3"});

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData.eventLocation, formData.eventDate, formData.searchYears);
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData( prev => ({
            ...prev, [name]: value
        }))
    }

    return (
        <form onSubmit = {handleSubmit}>

            <input type = "text"
            placeholder="Event Location (USA only)"
            value={formData.eventLocation}
            name="eventLocation"
            onChange = {handleChange} />

            <input type = "date"
            placeholder={formData.eventDate}
            value={formData.eventDate}
            name="eventDate"
            onChange = {handleChange} />

            <input type = "number"
            placeholder={formData.searchYears}
            value={formData.searchYears}
            name="searchYears"
            onChange = {handleChange} 
            min="1" max="10" step="1"/>

            <button>Go!</button>

            <div style={{ marginTop: '20px' }}>
                <p><strong>Form Data:</strong></p>
                <p>Location: {formData.eventLocation}</p>
                <p>Date: {formData.eventDate}</p>
                <p>Search Years: {formData.searchYears}</p>
            </div>
            
        </form>
        
    )

}   // END eventForm

export default EventForm;