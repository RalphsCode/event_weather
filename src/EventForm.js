import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventListArr } from "./eventListArray";
import {PreviousSearches} from "./PreviousSearches";

function EventForm() {
    // useState to store the form data
    const [formData, setFormData] = useState({
        eventLocation: localStorage.getItem('eventLocation') || "San Diego, CA", 
        eventDate: localStorage.getItem('eventDate') || "2025-07-15",
        searchYears: localStorage.getItem('searchYears') || "3",
        eventType: localStorage.getItem('eventType') || ""
    });
    
    // State for managing filtered options and dropdown visibility
    const [filteredOptions, setFilteredOptions] = useState(eventListArr);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    // Handle Submit function - puts form data in local storage
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.eventLocation || !formData.eventDate) {
            alert("Please fill in all required fields");
            return;
        }

        try {

            // Handle a leap year day (02-29 change to 02-28)
            let formDate = formData.eventDate;
            const mmdd = formDate.slice(5);
            if (mmdd == '02-29') {
                const yyyy = formDate.slice(0,4);
                formDate = yyyy + "-02-28";
                console.log("Event date changed to 02/28 as was leap day: Feb. 29th.")
            };  // END leap year
            
            localStorage.setItem("eventLocation", formData.eventLocation);
            localStorage.setItem("eventDate", formDate);
            localStorage.setItem("searchYears", formData.searchYears);
            localStorage.setItem("eventType", formData.eventType);

            // Forward to the confirm inputs page:
            navigate('/confirm');
        } catch (error) {
            console.error("Error storing form data:", error);
            alert("Unable to save form data. Please check your browser settings.");
        }
    }

    // Handle user input in the form - update the form data and filter options
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev, 
            [name]: value
        }));

        // For event type, filter and show dropdown
        if (name === 'eventType') {
            const filtered = eventListArr.filter(option => 
                option.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(value.length > 0 && filtered.length > 0);
        }
    }

    // Handle event type option selection
    const handleOptionSelect = (option) => {
        setFormData(prev => ({
            ...prev, 
            eventType: option
        }));
        setShowDropdown(false);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="eventDate">Event Date: </label>
                <input 
                    type="date"
                    placeholder={formData.eventDate}
                    value={formData.eventDate}
                    name="eventDate"
                    onChange={handleChange} 
                />
                <br />

                <label htmlFor="eventLocation">Event Location search term: </label>
                <input 
                    type="text"
                    placeholder="Event Location (USA only)"
                    value={formData.eventLocation}
                    name="eventLocation"
                    onChange={handleChange} 
                />
                <br />

                <label htmlFor="searchYears">Number of past years to review: </label>
                <input 
                    type="number"
                    placeholder={formData.searchYears}
                    value={formData.searchYears}
                    name="searchYears"
                    onChange={handleChange} 
                    min="1" 
                    max="10" 
                    step="1"
                />
                < br/>

                <label htmlFor="eventType">What's the event? </label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type="text"
                        placeholder={formData.eventType}
                        value={formData.eventType}
                        name="eventType"
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    {showDropdown && (
                        <div 
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                zIndex: 10
                            }}
                        >
                            {filteredOptions.map((option, index) => (
                                <div 
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    style={{
                                        padding: '5px',
                                        cursor: 'pointer',
                                        ':hover': { backgroundColor: '#f0f0f0' }
                                    }}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <br />
                <button type="submit">Go!</button>
            </form>
                    {/* Display the user's 5 most recent previous searches */}
            <PreviousSearches user_id={1} />
        </div>
    );
}

export default EventForm;