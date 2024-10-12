const express = require('express');
const connectDB = require('./connectDB');

const app = express();

// Connect to the database
connectDB();

app.get('/', (req, res) => {
    res.send('Agro-Sense Backend API is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
