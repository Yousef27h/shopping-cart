const ShoppingCart = require('./ShoppingCart');
const InventoryItem = require('./Item');

let users = [];
let count = 0;

module.exports = class User{

    constructor(name){
        this.name = name;
        this.cart = new ShoppingCart();
    }

    save(){
        this.id = ++count;
        users.push(this);
        return this;
    }

    static findById(userId){
        let index = users.findIndex(user => user.id == userId);
        if(index > -1 && index < users.length){
            return users[index];
        }else{
            throw new Error('User not found');
        }
    }

    static fetchAll(){
        return users;
    }

    addItem(itemId, qty){
        return this.cart.addItem(itemId, qty);
    }

    removeItem(itemId, qty){
        return this.cart.removeItem(itemId, qty);
    }

}
