import processAnnuals from "./processAnnuals";
import {sampleData5} from "./test_data/wxData.js";

describe("Testing the processAnnuals function", function() {

    test("Initial straightforward test", function() {
        const test1 = processAnnuals(sampleData5);
        expect(test1).toEqual({"expectedTMAX": "59.0", "expectedTMIN": "44.0", "expectedTemp": "51.7", "rainPercent": 0})
    })  // END test

})  // END describe