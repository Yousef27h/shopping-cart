const express = require('express');

const itemRouter = require('./routers/items');
const userRouter = require('./routers/users');
const loginRouter = require('./routers/login');
const User = require('./models/User');
const Item = require('./models/Item');
const cors = require('cors');

let usersList = [];

const app = express();

app.use(cors());
app.use(express.json());

let user = new User("yousef","111").save();
let user2 = new User("ahmad","222").save();
usersList.push(user.username);
usersList.push(user2.username);

let item1 = new Item("Apple", 2, 14, "./assets/apple.jpeg").save();
let item2 = new Item("Orange", 3, 25, "./assets/orange.jpeg").save();
let item3 = new Item("Banana", 4, 7, "./assets/banana.jpeg").save();

app.use(loginRouter);

app.use((req, res, next) => {
    const token = req.headers.authorization;
    if(token === 'null'){
        res.json({error: 'No Access Token'});
    }
    let user = usersList.map(user=> user.username).filter(username => username === token.split('-')[1]);
    if(user.length != 0){
        next();
    } else {
        res.json({error: 'Invalid Access Token'});
    }
})
app.use('/items', itemRouter);
app.use('/users', userRouter);

app.use((error, req, res, next)=>{
    res.status(500).json({error: 'Internal Server Error'});
})

let port = process.env.PORT || 3000;

app.listen(port, ()=>console.log('app is listening on ' + port));