const https = require('https');

// API request options
const options = {
  hostname: 'app.fit-track.net',
  path: '/api/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

// Request data
const data = JSON.stringify({
  mdl: 'login',
  act: 'ping'
});

// Make the request
const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', responseData);
    try {
      const parsedData = JSON.parse(responseData);
      console.log('Parsed JSON:', JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request Error: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();

console.log('Request sent to API...'); 