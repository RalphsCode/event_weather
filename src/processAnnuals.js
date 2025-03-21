// Function to process the annual results and return an expectation

function processAnnuals(weatherResults) {
    const TAVGarr = [];
    const TMINarr = [];
    const TMAXarr = [];
    const PRCParr = [];

    // NEED TO GET PAST THE DATE & TO WEATHER DATA 
    weatherResults.forEach(el => {
        const date = Object.keys(el)[0];
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
        const expectedTemp = (TAVGsum / TAVGarr.length).toFixed(1);
        
        const TMAXsum = TMAXarr.reduce((total, num) => total + num, 0); 
        const expectedTMAX = (TMAXsum / TMAXarr.length).toFixed(1);

        const TMINsum = TMINarr.reduce((total, num) => total + num, 0); 
        const expectedTMIN = (TMINsum / TMINarr.length).toFixed(1);

        console.log("Expected Temperature:", expectedTemp + "\u00B0 F" );
        console.log("Lowest Temperature found:", expectedTMIN + "\u00B0 F");
        console.log("Highest Temperature found:", expectedTMAX + "\u00B0 F");

        
        // Temperature Forecast Messagess
        const veryHotTemp = "Extremely high temperatures expected."; // Above 90°F
        const hotTemp = "High temperatures expected.";   // 76°F - 90°F 
        const niceTemp = "Looks great! Comfortable temperatures expected.";  // 61°F - 75°F
        const chillyTemp = "Cool temperatures expected.";    // 46°F - 60°F 
        const coldTemp = "Brrrr! Cold temperatures expected.";   // 33°F - 45°F
        const freezeTemp = "Freezing temperatures expected.";    // Below 32°F
        // END Temperature Forecast Messages

        let tempComment = '';
        if (expectedTemp <= 32) {
            tempComment = freezeTemp;
        } else if (expectedTemp <= 45) {
            tempComment = coldTemp;
        } else if (expectedTemp <= 60) {
            tempComment = chillyTemp;
        } else if (expectedTemp <= 75) {
            tempComment = niceTemp;
        } else if (expectedTemp <= 90) {
            tempComment = hotTemp;
        } else {
            tempComment = veryHotTemp;
        }

        console.log(`${tempComment} Expected Temperature: ${expectedTemp}\u00B0 F.`)

    // Review the PRCP data to determine if it rained or not:

    /**
     * dayPRCPbool null = No PRCP data for the day
     * dayPRCPbool false = PRCP data, no rain
     * dayPRCPbool true = PRCP data, > .02" rain reported
     */
    let rained = null;
    // Default if there is no PRCP data for the day:
    let annualPRCPbool = null;

    // If there is PRCP data
    if (PRCParr.length > 0) {
        // Defaule to no rain for day
        annualPRCPbool = false;
        // Count how many days had rain reported
        for (const bool of PRCParr) {
            if (bool === true){
                rained++;
            }   // END if
        }   // END for loop

        // Calculate if more than half the local wx stations reported rain > .02"
        const rainPercent = Math.floor((rained/PRCParr.length) * 100);

        // Precipitation Forecast Messages
        const expectPRCP = "Strong likelihood of significant precipitation.";    // 81% - 100% 
        const likelyPRCP = "Moderate to high chance of precipitation.";  // 51% - 80% 
        const chancePRCP = "Low to moderate chance of precipitation.";   // 31% - 50%
        const unLikelyPRCP = "It's looking good! Low chance of precipitation.";  // 11% - 30% 
        const noPRCP = "Great news! No precipitation expected."; // 0% - 10% 
        // END Precipitation Forecast Messages

        let PRCPcomment = '';
        console.log("PRCP Percent", rainPercent);

        if (rainPercent <= 10) {
            PRCPcomment = noPRCP;
        } else if (rainPercent <= 30) {
            PRCPcomment = unLikelyPRCP;
        } else if (rainPercent <= 50) {
            PRCPcomment = chancePRCP;
        } else if (rainPercent <= 80) {
            PRCPcomment = likelyPRCP;
        } else { 
            PRCPcomment = expectPRCP;
        }
        
        console.log(`${PRCPcomment} A ${rainPercent}% likelyhood of precipitation.`);

    }   // END if PRCP data

        return true;

}   // processAnnuals()

module.exports = processAnnuals;
