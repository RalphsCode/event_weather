// Process and summarize all the results received for a particular day

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
    const pointPRCP = [];
    const pointTAVG = [];
    for (const entry of data) {
        if (entry.datatype == "PRCP"){
            if (entry.value > 0) {
                pointPRCP.push(true);
            } else {
                pointPRCP.push(false);
            }
            
        } else if (entry.datatype == "TAVG"){
            pointTAVG.push(entry.value)
        }
    }   // END for loop

    // Determine if it rained or not:
    let rained = 0;
    for (const bool of pointPRCP) {
        if (bool === true){
            rained++;
        }   // END if
    }   // END for loop

    let dayPRCPbool = null;
    if (pointPRCP.length > 0) {
        dayPRCPbool = false;
    } else if ( rained/pointPRCP.length >= 0.5){
        dayPRCPbool = true; 
    }

    // Find the TAVG median for the day
    const dayTAVG = pointTAVG.length > 0 ? findMedian(pointTAVG) : null;
    
    // Create result object with the date as key
    const result = {};
    result[pointDate] = {"rain": dayPRCPbool, "temp": dayTAVG};
    
    return result;
}   // END processDay()

module.exports = processADay;