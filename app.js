import express from 'express';
import graphlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import schema from './api/schema/index';


const app = express();
const PORT = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nrblock');

app.get('/', (req, res) => {
    res.json({
        msg: 'E-wallet with graphQL'
    })
});

app.use('/api', graphlHTTP({
    schema: schema,
    graphiql: true
}));


app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});