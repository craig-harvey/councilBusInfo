const axios = require('axios');

async function fetchData() {
  try {
    const response = await axios.get('https://jp.translink.com.au/api/stop/timetable/001924');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
