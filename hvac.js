const express = require('express');
const app = express();

app.use(express.json());

app.post('/hvac/configure', (req, res) => {
  const { temperature, humidity } = req.body;
  res.send(`HVAC set to temperature: ${temperature}, humidity: ${humidity}`);
});

app.listen(3001, () => console.log('HVAC server running on port 3001'));
