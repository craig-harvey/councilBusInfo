function groupDepartures(departures) {
    // Group departure.Descriptions by headsign
    const grouped = departures.reduce((acc, dep) => {
      const key = dep.headsign; // e.g. "375", "385", "61"
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(dep.departureDescription);
      return acc;
    }, {});

    return grouped;
}

function buildTable(name, stopId, departures) {
  var rows = "";
  console.log(departures);

  for (const [headsign, departureList] of Object.entries(departures)) {
    rows += `
      <tr>
        <td><strong>${headsign}</strong></td>
        <td>${departureList[0] || ""}</td>
        <td>${departureList[1] || ""}</td>
        <td>${departureList[2] || ""}</td>
      </tr>
    `;
  }

    const table = `
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>#1</th>
            <th>#2</th>
            <th>#3</th>
          </tr>
        </thead>
        <tbody>
          <h2>${name} (Stop ID: ${stopId})</h2>
          ${rows || "<tr><td colspan='2'>No timetable data available</td></tr>"}
        </tbody>
      </table>
    `;

    return table;
}

exports.handler = async (event) => {
  try {
    /////////////////////////////////////////////////////
    // Default stop if none provided
    var stopId = event.queryStringParameters?.stop || "001338";
    var table = "<h1>Morning</h1>";

    // Fetch timetable data from Translink API
    var apiUrl = `https://jp.translink.com.au/api/stop/timetable/${stopId}`;
    var resp = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });
    console.log('>>> API Response:', resp);
    if (resp.status !== 200) {
      throw new Error(`Translink API error: ${resp.status} ${resp.statusText}`);
    }

    data = await resp.json();
    console.log('>>> Timetable Data:', data);
    table += buildTable("Woolworths Paddington", stopId, groupDepartures(data.departures));

    /////////////////////////////////////////////////////
    // Fetch timetable data from Translink API
    apiUrl = `https://jp.translink.com.au/api/stop/timetable/001429`;
    resp = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });
    console.log('>>> API Response:', resp);
    if (resp.status !== 200) {
      throw new Error(`Translink API error: ${resp.status} ${resp.statusText}`);
    }

    data = await resp.json();
    console.log('>>> Timetable Data:', data);
    table += buildTable("Kennedy Tce", "001429", groupDepartures(data.departures));

    table += "<br><br><br><h1>Afternoon</h1><br>";

    /////////////////////////////////////////////////////
    // Fetch timetable data from Translink API
    stopId = "000118";
    apiUrl = `https://jp.translink.com.au/api/stop/timetable/${stopId}`;
    resp = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });
    console.log('>>> API Response:', resp);
    if (resp.status !== 200) {
      throw new Error(`Translink API error: ${resp.status} ${resp.statusText}`);
    }

    data = await resp.json();
    console.log('>>> Timetable Data:', data);
    table += buildTable("City Stop 118", stopId, groupDepartures(data.departures));

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