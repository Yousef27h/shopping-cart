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
            alert('Out of stock!')
            throw new Error('Out of stock!');
        }

        return stockItem;
    }

    incrementQuantity(qty){
        
        let stockItem = this.findInventoryItem(this.itemId);

        if(stockItem.stock < qty){
            alert(`There are only ${stockItem.stock} stock items left`);
            throw new Error(`There are only ${stockItem.stock} stock items left`);
        }

        this.quantity = this.quantity + Number(qty);
        stockItem.stock = stockItem.stock - Number(qty);

        this.updatePrice();

        return this.quantity;
    }

    decrementQuantity(qty){
        let stockItem = Item.findById(this.itemId);

        stockItem.stock = stockItem.stock + Number(qty) ;

        this.quantity = this.quantity - Number(qty);
        console.log("inside lineItem : ",this.quantity)
        this.updatePrice();
        
        return this;
    }

    // updateQuantity(newQty){
    //     let stockItem = Item.findById(this.itemId);

    //     if(newQty > this.quantity){
    //         let stockQtyUpdated = stockItem.stock - (newQty - this.quantity);

    //         if(stockQtyUpdated < 0){
    //             throw new Error('There is no enough resources in inventory!')
    //         }else{
    //             stockItem.stock = stockQtyUpdated;
    //             this.quantity = newQty;
    //         }

    //     }else{
    //         let stockQtyUpdated = stockItem.stock + (this.quantity - newQty);
    //         stockItem.stock = stockQtyUpdated;
    //         this.quantity = newQty;
    //     }
        
    // }

    updatePrice(){
        let inventoryItem = this.findInventoryItem(this.itemId);
        
        this.price = Number(inventoryItem.price) * this.quantity;
    }
    


}
