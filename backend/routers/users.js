const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getUsers);

router.get('/:userId', userController.getUserById);

router.post('/', userController.addUser);

router.post('/:userId/items', userController.addItem);

router.get('/:userId/items', userController.getItems);

router.delete('/:userId/items', userController.deleteItem);

module.exports = router;