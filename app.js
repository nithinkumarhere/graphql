import fs from 'fs';
import http  from 'http';
import https  from 'https';
import express from 'express';
import graphlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import schema from './api/schema/index';
const privateKey = fs.readFileSync('/etc/letsencrypt/live/nrb.chilaka.in/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/nrb.chilaka.in/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = express();
const PORT = 5000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nrblock');

app.get('/', (req, res) => {
    res.json({
        msg: 'NRBlock graphQL Server'
    })
});

app.use('/api', graphlHTTP({
    schema: schema,
    graphiql: true
}));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//httpServer.listen(PORT);
httpsServer.listen(8443);