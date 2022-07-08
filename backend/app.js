const express = require('express');

const itemRouter = require('./routers/items');
const userRouter = require('./routers/users');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/items', itemRouter);
app.use('/users', userRouter);

let port = process.env.PORT || 3000;

app.listen(port, ()=>console.log('app is listening on ' + port));