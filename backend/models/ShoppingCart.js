const Item = require('./Item');
const LineItem = require('./LineItem');



module.exports = class ShoppingCart{

    constructor(){
        this.lineItems = [];
        this.lineItemsCount = 0;
    }

    addItem(itemId, qty){
        let inventoryItem = Item.findById(itemId);

        if(inventoryItem == undefined){
            throw new Error('Item does not exist in inventory');
        }

        let lineItem = this.lineItems
            .find(item => item.itemId == itemId)
            

        if(lineItem){
            lineItem.incrementQuantity(qty);
        }else{
            this.lineItems.push(new LineItem( ++this.lineItemsCount, itemId, qty));
        }

        return lineItem;
    }

    removeItem(itemId, qty){
        let inventoryItem = Item.findById(itemId);

        if(inventoryItem == undefined){
            throw new Error('Item does not exist in inventory');
        }

        let lineItem = this.lineItems
            .find(item => item.itemId == itemId)
            
        lineItem.decrementQuantity(qty);
    }

    calculateTotalPrice(){
        return this.lineItems.map(item => item.price).reduce((acc, item)=> acc+item,0);
    }
}