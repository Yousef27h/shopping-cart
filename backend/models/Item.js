let items = [{id: 1, name: "AppleJuice", price: "2", stock: 2}];
let count = 1;

module.exports = class Item{

    constructor(name, price, stock){
        this.name = name;
        this.price = price;
        this.stock = stock;
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