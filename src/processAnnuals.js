// Function to process the annual results and return an expectation

function processAnnuals(weatherResults) {
    console.log("Function to processAnnuals is running");
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

        return true;

}   // processAnnuals()

module.exports = processAnnuals;
