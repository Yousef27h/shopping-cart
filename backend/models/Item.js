let items = [];
let count = 0;

module.exports = class Item{

    constructor(name, price, stock, imageLink){
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.imageLink = imageLink;
    }

    save(){
        this.id = ++count;
        items.push(this);   
        return this;
    }

    static updateStockQty(itemId, qty){
        
        let index = items.findIndex(item => item.id == itemId);
        if(index > -1){
            items[index].stock = qty;
        }else{
            throw new Error('Item not found');
        }
    }

    static fetchAll(){
        return items;
    }

    static findById(itemId){
        let index = items.findIndex(item => item.id == itemId);
        if(index > -1 && index < items.length){
            return items[index];
        }else{
            throw new Error('Item not found');
        }
    }
}