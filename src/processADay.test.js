import processADay from "./processADay";
import {sampleData, sampleData1, sampleData2} from "./test_data/wxData.js";

describe ("Testing the ProcessADay function", function() {

    test("simple test, valid data", function() {
        const test1= processADay('2024-07-15', sampleData2);
        expect(test1).toEqual({"2024-07-15": {"rain": false, "temp": 58}})
    })  // END test

    test("simple test, more data", function() {
        const test1= processADay('2024-07-15', sampleData);
        expect(test1).toEqual({"2024-07-15": {"rain": false, "temp": 78}})
    })  // END test

    test("simple test, no TAVG/Temp data", function() {
        const test1= processADay('2024-07-15', sampleData1);
        expect(test1).toEqual({"2024-07-15": {"rain": false, "temp": null}})
    })  // END test

    test("No data", function() {
        const test1= processADay(null, null);
        expect(test1).toEqual("No weather data to process");
    })  // END test

}) // END describe