const axios = require('axios');

const sendData = () => {
  const data = {
    temperature: Math.random() * 10 + 20, // 20-30 degrees
    humidity: Math.random() * 30 + 40, // 40-70% humidity
    chairs_used: Math.floor(Math.random() * 20), // 0-20 chairs
    timestamp: new Date()
  };

  axios.post('http://localhost:3000/sensor-data', data)
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
};

setInterval(sendData, 5000); // Send data every 5 seconds
