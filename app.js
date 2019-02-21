import express from 'express';
import graphlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import schema from './api/schema/index';


const app = express();
const PORT = 3000;

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


app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});