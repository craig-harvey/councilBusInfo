const busTimes = require("../index.js");

var assert = require("assert");

describe("Verify bus numbers", function () {
  it("Should return 377 bus number", async function () {
    var result = await busTimes.fetchBusInfo(377);
    console.log("result: " + result);
    assert.equal(377, result.busNumber);
  });

  it("Should return 375 bus number", async function () {
    var result = await busTimes.fetchBusInfo(375);
    console.log("result: " + result.busNumber);
    assert.equal(375, result.busNumber);
  });
});
