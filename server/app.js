//import { Agent } from 'http';

const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    //write your logging code here
    let userAgent = req.headers['user-agent'];
    let time = new Date().toISOString();
    let method = req.method;
    let path = req.path; // + file?
    let version = req.protocol.toUpperCase() + '/' + req.httpVersion;
    let status = 200;

    userAgent = userAgent.replace(',', '');

    let logEntry = userAgent + ',' + time + ',' + method + ',' + path + ',' + version + ',' + status + '\n';

    console.log(logEntry);

    fs.appendFile('./server/log.csv', logEntry, 'utf8', (err) => {
        if (err) throw err;
    });

    next();
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.status(200).send('OK');
});

app.get('/logs', (req, res) => {

    fs.readFile('./server/log.csv', 'utf8', (err, logEntry) => {
        if (err) throw err;
        console.log(logEntry);

        let logs = [];
        let lines = logEntry.split('\n');

        lines.shift();
        lines.forEach(line => {
            lineItems = line.split(',');
            let log = {
                'Agent': lineItems[0],
                'Time': lineItems[1],
                'Method': lineItems[2],
                'Resource': lineItems[3],
                'Version': lineItems[4],
                'Status': lineItems[5]
            }
            logs.push(log);
            //LOG ROTATOR CHALLENGE HINTS
            //go to fs find latest file
            //check # of lines
            //if more than 20 lines, create new and make sure read/write comes from new log    
        });
        res.json(logs);
    });
});

module.exports = app;
