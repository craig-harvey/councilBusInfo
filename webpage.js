// index.mjs (Node.js 18+ runtime)
// const axios = require('axios')

exports.handler = async (event) => {
  try {
    // Default stop if none provided
    const stopId = event.queryStringParameters?.stop || "001338";

    // Fetch timetable data from Translink API
    const apiUrl = `https://jp.translink.com.au/api/stop/timetable/${stopId}`;
    const resp = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });

    console.log('>>> API Response:', resp);
    if (resp.status !== 200) {
      throw new Error(`Translink API error: ${resp.status} ${resp.statusText}`);
    }
// index.mjs (Node.js 18+ runtime)
// const axios = require('axios')

exports.handler = async (event) => {
  try {
    // Default stop if none provided
    const stopId = event.queryStringParameters?.stop || "001338";

    // Fetch timetable data from Translink API
    const apiUrl = `https://jp.translink.com.au/api/stop/timetable/${stopId}`;
    const resp = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });
    console.log('>>> API Response:', resp);
    if (resp.status !== 200) {
      throw new Error(`Translink API error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    console.log('>>> Timetable Data:', data);

    // Build HTML table rows
    const rows = (data?.departures || []).map((item) => `
      <tr>
        <td>${item.headsign || ""}</td>
        <td>${item.departureDescription || ""}</td>
      </tr>
    `).join("");

    const table = `
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          ${rows || "<tr><td colspan='2'>No timetable data available</td></tr>"}
        </tbody>
      </table>
    `;

    // Full HTML page
    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Translink Timetable – Stop ${stopId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2.5rem; background: #f8fafc; }
    h1 { font-size: 2.4rem; margin-bottom: 1rem; }
    table { border-collapse: collapse; width: 100%; font-size: 2rem; background: #fff; }
    th { background: #1d4ed8; color: white; text-align: left; }
    th, td { border: 1px solid #cbd5e1; padding: 0.5rem; }
    tr:nth-child(even) { background: #f1f5f9; }
    @media (max-width: 600px) {
      th:nth-child(2), td:nth-child(2) {
        display: none; /* hide Destination column on very small screens */
      }
    }
  </style>
</head>
<body>
  <h1>Woolworths Paddintgton (Stop ID: ${stopId})</h1>
  ${table}
</body>
</html>
    `;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*", // optional
      },
      body: html,
    };

  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `Error: ${err.message}`,
    };
  }
};

// For local testing only:
if (require.main === module) {
  (async () => {
    const event = { queryStringParameters: { stop: "001338" } };
    const result = await exports.handler(event);
    console.log(result.body); // This will print the HTML to your terminal
  })();
}
    const data = await resp.json();
    console.log('>>> Timetable Data:', data);

    // Build HTML table rows
    const rows = (data?.departures || []).map((item) => `
      <tr>
        <td>${item.headsign || ""}</td>
        <td>${item.departureDescription || ""}</td>
      </tr>
    `).join("");

    const table = `
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Destination</th>
          </tr>
        </thead>
        <tbody>
          ${rows || "<tr><td colspan='2'>No timetable data available</td></tr>"}
        </tbody>
      </table>
    `;

    // Full HTML page
    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Translink Timetable – Stop ${stopId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; background: #f8fafc; }
    h1 { font-size: 1.4rem; margin-bottom: 1rem; }
    table { border-collapse: collapse; width: 100%; background: #fff; }
    th { background: #1d4ed8; color: white; text-align: left; }
    th, td { border: 1px solid #cbd5e1; padding: 0.5rem; }
    tr:nth-child(even) { background: #f1f5f9; }
    @media (max-width: 600px) {
      th:nth-child(2), td:nth-child(2) {
        display: none; /* hide Destination column on very small screens */
      }
    }
  </style>
</head>
<body>
  <h1>Stop Timetable (ID: ${stopId})</h1>
  ${table}
</body>
</html>
    `;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*", // optional
      },
      body: html,
    };

  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `Error: ${err.message}`,
    };
  }
};

// For local testing only:
if (require.main === module) {
  (async () => {
    const event = { queryStringParameters: { stop: "001338" } };
    const result = await exports.handler(event);
    console.log(result.body); // This will print the HTML to your terminal
  })();
}