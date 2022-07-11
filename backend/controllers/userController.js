const User = require('../models/User');
const Item = require('../models/Item');

exports.addUser = (req, res, next) => {
    let newUser = new User(req.body.username, req.body.password).save();
    res.status(201).json(newUser);
}

exports.addItem = (req, res, next) => {
    let user = User.findById(req.params.userId);
    res.status(201).json(user.addItem(req.body.itemId, req.body.qty));
}

exports.getUserById = (req, res, next)=>{
    res.status(200).json(User.findById(req.params.userId));
}

exports.getUsers = (req, res, next)=>{
    res.status(200).json(User.fetchAll());
}

exports.getItems = (req, res, next)=>{
    let user = User.findById(req.params.userId);
    let resArr = user.cart.lineItems.map(item => {
        let obj = {lineItem: item, inventoryItem: Item.findById(item.itemId)};
        return obj;
    })
    res.status(200).json(resArr);
}

exports.deleteItem = (req, res, next)=>{
    let user = User.findById(req.params.userId);
    res.status(204).json(user.removeItem(req.query.itemId));
}

exports.updateQty = (req, res, next) =>{
    let user = User.findById(req.params.userId);
    res.status(204).json(user.updateQty(req.query.itemId, req.query.newQty));
}

exports.deleteItems = (req, res, next) =>{
    let user = User.findById(req.params.userId);
    res.status(204).json(user.cart.removeLineItems());
}