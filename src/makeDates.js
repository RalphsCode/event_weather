/** Function to generate the dates for the weather search
* Passed in argument should be a string like: '2027-07-12'
* Output is an array of X date strings eg: ['2024-01-16', '2023-01-16', '2022-01-16', ...]
* The numer of elements is determined by the inYears argument.
* The datesArray is added to Local Storage.
*/

function makeDates(eventDate, inYears) {
    // Edit the year here as needed.
    const currentYear = 2025;
    const searchYears = (currentYear-inYears-1);
    const datesArr = [];
    const [year, month, day] = eventDate.split('-').map(Number); // Convert to numbers

    // Validate the initial date
    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        console.log("Invalid date format passed into MakeDates function");
        return "Invalid date format"; 
      } // END if...
    
    for (let i = currentYear-1; i>searchYears; i--){
        const makeDate = `${i}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datesArr.push(makeDate);
    } // END for loop...
    localStorage.setItem("Dates Array:", datesArr);
    return datesArr;
}       // END makeDates()

export default makeDates;