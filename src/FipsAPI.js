// Get the location FIPS code from the FCC website

import axios from 'axios';

const FipsAPI = async (lat, lng) => {
    try {
        const response = await axios.get(`https://geo.fcc.gov/api/census/block/find?format=json&latitude=${lat}&longitude=${lng}&showall=true`);
        const FIPS = response.data.County.FIPS;
        
        return FIPS;
    } catch (err) {
        console.log("Error in FIPS API data retrieval:", err);
        // Use a default FIPS for continuation: 06075 (San Francisco)
        return '06075';
    }
}   // END FipsAPI()

export default FipsAPI;