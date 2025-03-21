/** Function to process the annual results and return a weather expectation.
 * Receives an array containing objects, and each object is a daily weather summary.
 * The paramater passed in is the weatherResults, pulled from Local Storage.
 * weatherResults looks like this:
 *  {{2024-04-12: {rain: false, temp: 54, maxTemp: 59, minTemp: 48}}, {2023-04-12: {rain: false, etc...}}
 * 
 * Function is called by the ResultsPage.js Component.
 * 
 * Function returns:
 *      (1) expectedTemp  (2) expectedTMAX  (3) expectedTMIN  (4) rainPercent
 * 
 * Example:
 *  {"expectedTMAX": "59.0", "expectedTMIN": "44.0", "expectedTemp": "51.7", "rainPercent": 0}
 * */ 

function processAnnuals(weatherResults) {
    const TAVGarr = [];
    const TMINarr = [];
    const TMAXarr = [];
    const PRCParr = [];
    let date = '';
    // Group the daily results into an array
    weatherResults.forEach(el => {
        date = Object.keys(el)[0];
        const dailyData = el[date];

        if (dailyData.temp != null) {
            TAVGarr.push(dailyData.temp);
        };
        if (dailyData.minTemp != null) {
            TMINarr.push(dailyData.minTemp);
        };
        if (dailyData.maxTemp != null) {
            TMAXarr.push(dailyData.maxTemp);
        };
        if (dailyData.rain != null) {
            PRCParr.push(dailyData.rain);
        };

    })

        console.log("PRCP array for all years:", PRCParr);
        console.log("TAVG array for all years:", TAVGarr);
        console.log("TMIN array for all years:", TMINarr);
        console.log("TMAX array for all years:", TMAXarr);
        
        const TAVGsum = TAVGarr.reduce((total, num) => total + num, 0); 
        // Calculate the final expected Temp
        const expectedTemp = (TAVGsum / TAVGarr.length).toFixed(1);
        // Calculate the final expected TMAX and TMIN
        const TMAXsum = TMAXarr.reduce((total, num) => total + num, 0); 
        const expectedTMAX = (TMAXsum / TMAXarr.length).toFixed(1);
        const TMINsum = TMINarr.reduce((total, num) => total + num, 0); 
        const expectedTMIN = (TMINsum / TMINarr.length).toFixed(1);

        //  HOW TO DISPLAY THE DEGREES CIRCLE "\u00B0 F");


    // Process the PRCP data

    /**
     * dayPRCPbool null = No PRCP data for that day
     * dayPRCPbool false = PRCP data received, NO RAIN reported
     * dayPRCPbool true = PRCP data received, >0.02" rain reported
     */

    let rainPercent = null;
    let rained = null;
    // Default if there is no PRCP data for the day in history:
    let annualPRCPbool = null;

    // If there is PRCP data
    if (PRCParr.length > 0) {
        // Default to no rain for day
        annualPRCPbool = false;
        // Count how many days had rain reported
        for (const bool of PRCParr) {
            if (bool === true){
                rained++;
            }   // END if
        }   // END for loop

        // Calculate if more than half the local wx stations reported rain on the day

        // This is the final PRCR PERCENT data for the day in history:
        rainPercent = Math.floor((rained/PRCParr.length) * 100);

    }   // END if PRCP data

    // Build the end result to return
    const result = {"expectedTemp": expectedTemp, "expectedTMAX": expectedTMAX, "expectedTMIN": expectedTMIN, "rainPercent": rainPercent}

    console.log("result from processAnnuals:", result);
    return result;

}   // processAnnuals()

module.exports = processAnnuals;
