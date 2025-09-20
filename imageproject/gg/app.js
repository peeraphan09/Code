const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/capture', async (req, res) => {
    try {
        const imageResponse = await axios({
            url: 'http://192.168.21.143/capture', // แทนที่ <ESP32_CAM_IP> ด้วย IP ของ ESP32-CAM
            method: 'GET',
            responseType: 'arraybuffer',
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filePath = path.join(__dirname, `image_${timestamp}.jpg`);

        fs.writeFileSync(filePath, imageResponse.data);
        res.send(`Image saved with timestamp: ${timestamp}`);
    } catch (error) {
        res.status(500).send('Error capturing image');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
