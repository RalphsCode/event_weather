// API call to Google Maps for the location data

import axios from 'axios';

const GoogleMapsAPI = async (searchString) => {
        try {
            const keyString = process.env.REACT_APP_GOOGLE_KEY;
            
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchString}&key=${keyString}`);

            if (response.data){
                const result = response.data.results[0];
                return {
                    location: result.name,
                    formattedAddress: result.formatted_address,
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng
                };
            } else {
                throw new Error("No location data found");
            }
            
            }   // END try
        catch (err) {
            console.error("Error fetching Google location data:", err);
        }   // END catch

}   // END GoogleMapsAPI()

export default GoogleMapsAPI;