const http = require('http');
const express  = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(`${__dirname}/public/dashboard.html`));
});

server.listen(3000, () => {
    console.log(`Listening on %d ${server.address().port}`);
});