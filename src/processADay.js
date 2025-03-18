/** Process and summarize all the results received for a particular day.
 * Data to process is received from one NOAA NCDC API call
 * */ 

console.log("JS is running!");

// Helper function
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
    // Summarize a days data received from NOAA NCDC API call.

    if (!data){
        return "No weather data to process"
    }
    // Arrays to store the daily PRCP & TAVG weather readings:
    const pointPRCP = [];
    const pointTAVG = [];

    // Loop thru the day's data received from NCDC, and
    // populate the PRCP & TAVG arrays
    for (const entry of data.results) {

        // check for PRCP in the data:
        if (entry.datatype == "PRCP"){
            if (entry.value > 0.02) {   // don't count insignificant rain
                // if there was rain enter a true in the rain arr, no-rain: false
                pointPRCP.push(true);
            } else {
                pointPRCP.push(false);
            }
           
        // check for TAVG in the data:    
        } else if (entry.datatype == "TAVG"){
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
        // Defaule to no rain for day
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
    const dayTAVG = pointTAVG.length > 0 ? findMedian(pointTAVG) : null;

    // Create result object with the date as key
    const result = {};
    result[pointDate] = {"rain": dayPRCPbool, "temp": dayTAVG};
    
    console.log("Days weather result:", result);
    
    return result;
}   // END processDay()

module.exports = processADay;