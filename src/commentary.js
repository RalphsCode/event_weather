/** 
 * This is where the result strings are defined and determined
 */

export function commentary(expectedTemp, rainPercent) {
        // Temperature Forecast Messagess
        const T1 = "Extremely high temperatures expected."; // Above 90°F
        const T2 = "High temperatures expected.";   // 76°F - 90°F 
        const T3 = "Looks great! Comfortable temperatures expected.";  // 61°F - 75°F
        const T4 = "Cool temperatures expected.";    // 46°F - 60°F 
        const T5 = "Brrrr! Cold temperatures expected.";   // 33°F - 45°F
        const T6 = "Freezing temperatures expected.";    // Below 32°F
        // END Temperature Forecast Messages

        let tempComment = '';
        if (expectedTemp <= 32) {
            tempComment = T6;               // Freezing
        } else if (expectedTemp <= 45) {
            tempComment = T5;               // Cold
        } else if (expectedTemp <= 60) {
            tempComment = T4;               // Cool
        } else if (expectedTemp <= 75) {
            tempComment = T3;               // Comfortable
        } else if (expectedTemp <= 90) {
            tempComment = T2;               // High Temperature
        } else {
            tempComment = T1;               // Extremely High
        }

        console.log(`${tempComment} Expected Temperature: ${expectedTemp}\u00B0 F.`)


        // Precipitation Forecast Messages
        const P5 = "Strong likelihood of significant precipitation.";    // 81% - 100% 
        const P4 = "Moderate to high chance of precipitation.";  // 51% - 80% 
        const P3 = "Low to moderate chance of precipitation.";   // 31% - 50%
        const P2 = "It's looking good! Low chance of precipitation.";  // 11% - 30% 
        const P1 = "Great news! No precipitation expected."; // 0% - 10% 
        // END Precipitation Forecast Messages

        let PRCPcomment = '';
        console.log("PRCP Percent", rainPercent);

        if (rainPercent <= 10) {
            PRCPcomment = P1;               // No precipitation
        } else if (rainPercent <= 30) {
            PRCPcomment = P2;               // Low chance
        } else if (rainPercent <= 50) {
            PRCPcomment = P3;               // Low to moderate chance
        } else if (rainPercent <= 80) {
            PRCPcomment = P4;               // Moderate to high chance
        } else { 
            PRCPcomment = P5;               // Strong chance
        }
        
        console.log(`${PRCPcomment} A ${rainPercent}% likelyhood of precipitation.`);

        return expected_weather_commentary;

    }   // END commentary()