const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUserById);

router.post('/', userController.addUser);

router.post('/:userId/items', userController.addItem);

router.get('/:userId/items', userController.getItems);

router.delete('/:userId/items', userController.deleteItem);

router.delete('/:userId/lineItems', userController.deleteItems);

router.patch('/:userId/items', userController.updateQty);

module.exports = router;