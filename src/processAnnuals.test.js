import processAnnuals from "./processAnnuals";
import {sampleData5, sampleData6, sampleData7} from "./test_data/wxData.js";

describe("Testing the processAnnuals function", function() {

    test("Initial straightforward test", function() {
        const test1 = processAnnuals(sampleData5);
        expect(test1).toEqual({"expectedTMAX": "59.0", "expectedTMIN": "44.0", "expectedTemp": "51.7", "rainPercent": 0})
    })  // END test

    test("All passed in valiables == null", function() {
        const test1 = processAnnuals(sampleData6);
        expect(test1).toEqual({"expectedTMAX": "NaN", "expectedTMIN": "NaN", "expectedTemp": "NaN", "rainPercent": null})
    })  // END test

    test("All passed in valiables == null, except temp", function() {
        const test1 = processAnnuals(sampleData7);
        expect(test1).toEqual({"expectedTMAX": "NaN", "expectedTMIN": "NaN", "expectedTemp": "55.3", "rainPercent": null})
    })  // END test
    
    test("No paramaters, nothing passed in.", function() {
        const test1 = processAnnuals();
        expect(test1).toEqual({"expectedTMAX": "NaN", "expectedTMIN": "NaN", "expectedTemp": "55.3", "rainPercent": null})
    })  // END test

})  // END describe