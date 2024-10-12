const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection URI
const mongoURI = 'mongodb+srv://db:dbUser@sit314.1t6lv.mongodb.net/sit314?retryWrites=true&w=majority';

// MongoDB connection setup
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the schema for logging sensor data
const LogSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  chairs_used: Number,
  timestamp: Date
});

// Create a model for the logs
const LogModel = mongoose.model('Log', LogSchema);

// Endpoint to receive sensor data
app.post('/sensor-data', async (req, res) => {
  const data = req.body;

  // Decision logic for adjusting HVAC based on sensor data
  if (data.temperature > 25 && data.chairs_used > 15) {
    try {
      // Call the HVAC system to adjust settings
      await axios.post('http://localhost:3001/hvac/configure', { temperature: 20, humidity: data.humidity });
      console.log('HVAC adjusted');
    } catch (err) {
      console.error('Error adjusting HVAC:', err);
    }
  }

  // Log the sensor data into MongoDB
  try {
    const log = new LogModel(data);
    await log.save();
    console.log('Sensor data logged');
  } catch (err) {
    console.error('Error saving log:', err);
  }

  res.send('Data received and logged');
});

// Start the server
app.listen(3000, () => console.log('Edge server running on port 3000'));
