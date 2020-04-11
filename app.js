require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static('./'));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})