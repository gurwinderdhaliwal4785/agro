const nodemailer = require('nodemailer');

// Email setup
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});

function sendAlert(subject, message) {
    let mailOptions = {
        from: 'agro-sense@gmail.com',
        to: 'farmer@example.com',
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function checkThresholds(sensorData) {
    if (sensorData.soilMoisture < 30) {
        sendAlert('Soil Moisture Alert', 'Soil moisture is below 30%. Please irrigate your crops.');
    }
}

// Example usage
let sensorData = {
    soilMoisture: 28 // Sample data from your system
};

checkThresholds(sensorData);
