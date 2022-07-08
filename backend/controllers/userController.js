const express = require('express');

const User = require('../models/User');

exports.addUser = (req, res, next) => {
    let newUser = new User(req.body.name).save();
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
    res.status(200).json(user.cart.lineItems);
}

exports.deleteItem = (req, res, next)=>{
    let user = User.findById(req.params.userId);
    
    res.status(201).json(user.removeItem(req.body.itemId, req.body.qty));
}