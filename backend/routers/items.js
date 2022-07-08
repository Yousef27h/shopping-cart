const express = require('express');

const itemController = require('../controllers/itemController');

const  router = express.Router();

router.get('/', itemController.getItems);

router.get('/:itemId', itemController.getItemById);

router.post('/', itemController.addItem);

router.patch('/:itemId', itemController.updateItemQuantity);


module.exports = router;