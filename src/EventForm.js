import React, {useState} from "react";

function EventForm() {

    const [eventLocation, setEventLocation] = useState('San Diego, CA');

    const handleChange = (e) => {
        setEventLocation(e.target.value)
    }

    return (
        <form>
            <input type = "text"
            placeholder="Event Location (USA only)"
            value={eventLocation}
            onChange = {handleChange} />
            <button>Go!</button>
            <p>Location: {eventLocation}</p>
        </form>
        
    )

}   // END eventForm

export default EventForm;