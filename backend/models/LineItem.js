const Item = require('./Item');


module.exports = class LineItem{

    constructor(id, itemId, quantity){
        this.id = id;
        this.itemId = itemId;
        this.quantity = 0;
        this.incrementQuantity(quantity);
        this.updatePrice();
    }

    findInventoryItem(itemId){
        let stockItem = Item.findById(itemId);
        if(stockItem == undefined){
            throw new Error('Out of stock!');
        }

        return stockItem;
    }

    incrementQuantity(qty){
        
        let stockItem = this.findInventoryItem(this.itemId);

        let stockLeft = stockItem.stock - qty ; 

        if(stockLeft < 0){
            throw new Error(`There are only ${stockItem.stock} stock items left`);
        }

        stockItem.stock = stockLeft;

        this.quantity = this.quantity + qty;

        this.updatePrice();

        return this.quantity;
    }

    decrementQuantity(qty){
        let stockItem = Item.findById(this.itemId);

        stockItem.stock = stockItem.stock + qty ;

        this.quantity = this.quantity - qty;

        this.updatePrice();

        return this.quantity;
    }

    updatePrice(){
        let inventoryItem = this.findInventoryItem(this.itemId);
        
        this.price = Number(inventoryItem.price) * this.quantity;
    }
    


}
