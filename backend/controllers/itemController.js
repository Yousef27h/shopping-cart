const express = require('express');

const Item = require('../models/Item');

exports.getItems = (req, res, next) => {
    res.status(200).json(Item.fetchAll());
}

exports.getItemById = (req, res, next) =>{ 
    res.status(200).json(Item.findById(req.params.itemId));
}

exports.updateItemQuantity = (req, res, next) => {
    Item.updateStockQty(req.params.itemId, req.body.quantity);
    res.status(200).end();
}

exports.addItem = (req, res, next) => {
    let reqBody = req.body;
    let newItem = new Item(reqBody.itemName, reqBody.itemPrice, reqBody.stockQty).save();
    res.status(201).json(newItem);
}