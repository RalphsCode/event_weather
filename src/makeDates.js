/** Function to generate the dates for the weather search
* Passed in argument should be a string like: '2027-07-12'
* Output is an array of 10 date strings eg: ['2024-01-16', '2023-01-16', '2022-01-16', ...]
* To limit to the requested number of years use: 
* myDates.slice(0,searchYears)
*/

function makeDates(eventDate) {
    // Edit the year here as needed.
    const currentYear = 2025;
    const datesArr = [];
    const [year, month, day] = eventDate.split('-').map(Number); // Convert to numbers
    // Validate the initial date
    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        return "Invalid date format"; // invalid input
      } // ENF if...
    
    for (let i = currentYear-1; i>currentYear-11; i--){
        const makeDate = `${i}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datesArr.push(makeDate);
    } // END for loop...
    return datesArr;
}       // END makeDates()

export default makeDates;