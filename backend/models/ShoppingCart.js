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

    removeItem(itemId){
        console.log(itemId);
        let inventoryItem = Item.findById(itemId);

        if(inventoryItem == undefined){
            alert('Item does not exist in inventory')
            throw new Error('Item does not exist in inventory');
        }   

        let itemToDelete = this.lineItems.find(item => item.itemId == itemId);
        inventoryItem.stock = inventoryItem.stock + Number(itemToDelete.quantity);

        this.lineItems = this.lineItems.filter(item => item.itemId != itemId);

        this.lineItemsCount = this.lineItems.length;

        for (let i = 1; i < this.lineItemsCount; i++) {
            this.lineItems[i].id = i;       
        }
        console.log(this.lineItems)
    }

    updateQty(itemId, newQty){
        let inventoryItem = Item.findById(itemId);

        if(inventoryItem == undefined){
            alert('Item does not exist in inventory');
            throw new Error('Item does not exist in inventory');
        }


        let lineItem = this.lineItems
            .find(item => item.itemId == itemId)
         
        let oldQty = lineItem.quantity;
        if(newQty > oldQty){
            let diff = newQty - oldQty;
            if(inventoryItem.stock < diff){
                alert('There are no enough resources');
                throw new Error('There are no enough resources');
            }
            inventoryItem.stock = inventoryItem.stock - diff;
        }else{
            let diff = oldQty - newQty;
            inventoryItem.stock = inventoryItem.stock + diff;
        }
        lineItem.quantity = newQty;
        lineItem.updatePrice();

    }

    removeLineItems(){
        this.lineItems = [];
        this.lineItemsCount = 0;
    }

    calculateTotalPrice(){
        return this.lineItems.map(item => item.price).reduce((acc, item)=> acc+item,0);
    }
}