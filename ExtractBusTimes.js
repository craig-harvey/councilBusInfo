const axios = require('axios');

var stopId = '001429';  // Stop ID for the bus stop

async function fetchBusInfo(stopId) {
  try {
    const response = await axios.get('https://jp.translink.com.au/api/stop/timetable/' + stopId);
    var nextBus = {
        "busNumber": response.data.departures[0].headsign,
        "due": response.data.departures[0].departureDescription
    };
    console.log(nextBus);
    return nextBus;
  } catch (error) {
    console.error(error);
  }
}

fetchBusInfo(stopId);
