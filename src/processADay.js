/** 
 * Process and summarize all the results received for a particular day.
 * 
 * Data to process is received from an NOAA API call for data relating to one day.
 * Pass in:
 *  (1) the date used in the weather request, 
 *  (2) The data received from the NOAA API call.
 * 
 * This function is called from the GetWxData.js component.
 * 
 * Returns an object containing a days summary. 
 * Example output:  
    {2024-04-12: {rain: false, temp: 54, maxTemp: 59, minTemp: 48}

 * If there is an absence of data (no temp data, or PRCP data),
 * null values are returned. For example if no temp nor PRCP data was returned from API call,
 * The output would be:
 *  {2024-04-12: {rain: null, temp: null, maxTemp: null, minTemp: null}}

 * If no data is passed in from the NOAA API call, returns: "No weather data to process"
 */ 

// Helper function used to find the median temperature for a day
function findMedian(arr) {
    // 1. Sort the array in ascending order.
const sortedArr = arr.slice().sort((a, b) => a - b);

const length = sortedArr.length;
const middle = Math.floor(length / 2);

// 2. Check if the array length is even or odd.
if (length % 2 === 0) {
  // If even, the median is the average of the two middle elements.
  return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
} else {
  // If odd, the median is the middle element.
  return sortedArr[middle];
}
}   // END findMedian()


function processADay(pointDate, data) {
    // Summarize one days data as received from NOAA NCDC API call.

    if (!data){
        return "No weather data to process"
    }

    const numResults = data.length;
    console.log("numResults:", numResults);

    // Arrays to store the daily PRCP & TAVG weather readings:
    const pointPRCP = [];
    const pointTAVG = [];

    // Loop thru the day's data received from NCDC, and
    // populate the PRCP & TAVG arrays
    for (const entry of data) {

        // check for PRCP in the data:
        if (entry.datatype === "PRCP"){
            if (entry.value > 0.02) {   // don't count insignificant rain
                // if there was rain enter a true in the rain arr, no-rain: false
                pointPRCP.push(true);
            } else {
                pointPRCP.push(false);
            }
           
        // check for TAVG in the data:    
        } else if (entry.datatype === "TAVG"){
            // push the temp value into the temp arr
            pointTAVG.push(entry.value)
        }
    }   // END for loop pulling PRCP & TAVG data from the NCDC data


    // Review the PRCP data to determine if it rained or not:

    /**
     * dayPRCPbool null = No PRCP data for the day
     * dayPRCPbool false = PRCP data, no rain
     * dayPRCPbool true = PRCP data, > .02" rain reported
     */
    let rained = null;
    // Default if there is no PRCP data for the day:
    let dayPRCPbool = null;

    // If there is PRCP data
    if (pointPRCP.length > 0) {
        // Default to no rain for day
        dayPRCPbool = false;
        // Count how many days had rain reported
        for (const bool of pointPRCP) {
            if (bool === true){
                rained++;
            }   // END if
        }   // END for loop

        // Calculate if more than half the local wx stations reported rain > .02"
        if ( rained/pointPRCP.length >= 0.5){
            // Set it to true that it rained this day
            dayPRCPbool = true; 
        }   // END if

    }   // END if PRCP data


    // Process the TAVG data to calculate the median Temp for the day:
    let dayTAVG = null;
    let dayTMAX = null;
    let dayTMIN = null;

    // create a dayTAVG if there is are TAVG data points
    if (pointTAVG.length > 0) {
        dayTAVG =  findMedian(pointTAVG);
        // Create a dayTMIN & dayTMAX if there are more than one TAVG data points
        // NOTE: not pulling TAVG nor TMAX from NOAA/NCDC as those data points are too rare
        if (pointTAVG.length > 1) {
            dayTMIN = Math.min(...pointTAVG) || null;
            dayTMAX = Math.max(...pointTAVG) || null;
            }  
    }   // END if

    // Create result object with the date as key
    const result = {};
    result[pointDate] = { "records": numResults, "rain": dayPRCPbool, "temp": dayTAVG, "maxTemp": dayTMAX, "minTemp": dayTMIN };
    
    // Return an object containing a days summary
    return result;
}   // END processDay()

module.exports = processADay;