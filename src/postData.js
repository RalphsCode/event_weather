/** Function to accumulate the search data used to populate the searches and wx-data tables in the database.
Also sends the data to the API hosted on the backend that posts the data to the db.

Sample Data:
  "user_id":"1", 
	"evt_location_ent":"grand canyon", 
	"evt_location_act":"Grand Canyon National Park", 
	"evt_date": "2025-06-21", 
	"evt_desc":"Birthday", 
	"num_years":3, 
	"ZipRef":"04005", 
	"rain_prcnt":33, 
	"exp_temp":84,
	"max_temp":null,
	"min_temp":null,
	"sunrise":"6:24:12 AM",
	"sunset":"8:10:01 PM",
  "weatherResults":[{"2024-07-15":{"records":7,"rain":false,"temp":84,"maxTemp":null,"minTemp":null}},{"2023-07-15":{"records":7,"rain":false,"temp":87,"maxTemp":null,"minTemp":null}},{"2022-07-15":{"records":9,"rain":true,"temp":81,"maxTemp":null,"minTemp":null}}]

*/

import axios from 'axios';
    
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function postData(){
  try {
    const user_id = 1;
    const evt_location_ent = localStorage.getItem("eventLocation");
    const location = JSON.parse(localStorage.getItem("locationData"));
    const evt_location_act = location.location;
    const evt_date = localStorage.getItem("eventDate");
    const evt_desc = localStorage.getItem("eventType");
    const num_years = localStorage.getItem("searchYears");
    const ZipRef = localStorage.getItem("ZipRef");
    const prediction = JSON.parse(localStorage.getItem("prediction"));
    const rain_prcnt = prediction.rainPercent;
    const exp_temp = prediction.expectedTemp;
    const max_temp = prediction.expectedTMAX;
    const min_temp = prediction.expectedTMIN;
    const solunar = JSON.parse(localStorage.getItem("solunar"));
    const sunrise = solunar.sunrise;
    const sunset = solunar.sunset;
    const weatherResults = JSON.parse(localStorage.getItem("weatherResults"));

  
    // Send the data to the API on the backend

    const response = await axios.post(`${API_BASE_URL}/api/search`, {
        user_id,
        evt_location_ent,
        evt_location_act,
        evt_date,
        evt_desc,
        num_years,
        ZipRef,
        rain_prcnt,
        exp_temp,
        max_temp,
        min_temp,
        sunrise,
        sunset,
        weatherResults
    });

    return response.data;
  } catch (err) {
    console.log("Error trying to execute database write API call:", err);
    return { error: true, message: err.message }; 
  }
}