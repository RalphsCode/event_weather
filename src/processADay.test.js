import processADay from "./processADay";
import {sampleData, sampleData1, sampleData2, sampleData3, sampleData4} from "./test_data/wxData.js";

describe ("Testing the ProcessADay function", function() {

    test("simple test, PRCP data, only 1 TAVG data point", function() {
        const test1= processADay('2024-07-15', sampleData2);
        expect(test1).toEqual({"2024-07-15": {"rain": false, "temp": 58, "maxTemp": null, "minTemp": null}})
    })  // END test

    test("simple test, more data, PCRP & TAVG data present", function() {
        const test1= processADay('2024-07-15', sampleData);
        expect(test1).toEqual({"2024-07-15": {"rain": false, "temp": 78, "maxTemp": 87, "minTemp": 66}})
    })  // END test

    test("simple test, only PRCP data, no TAVG/Temp data", function() {
        const test1= processADay('2024-07-15', sampleData1);
        expect(test1).toEqual({"2024-07-15": {"rain": false, "temp": null, "maxTemp": null, "minTemp": null}})
    })  // END test

    test("simple test, only TAVG data, no PRCP data", function() {
        const test1= processADay('2024-07-15', sampleData4);
        expect(test1).toEqual({"2024-07-15": {"rain": null, "temp": 79, "maxTemp": 87, "minTemp": 72}})
    })  // END test

    test("No data", function() {
        const test1= processADay(null, null);
        expect(test1).toEqual("No weather data to process");
    })  // END test

    test("No weather data for that day/weather station", function() {
        const test1= processADay('2024-07-15', sampleData3);
        expect(test1).toEqual({"2024-07-15": {"rain": null, "temp": null, "maxTemp": null, "minTemp": null}});
    })  // END test

}) // END describe