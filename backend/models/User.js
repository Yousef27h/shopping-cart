const ShoppingCart = require('./ShoppingCart');
const InventoryItem = require('./Item');

let users = [];
let count = 0;
// module.exports.usersList = users;
module.exports = class User{

    constructor(username, password){
        this.username = username;
        this.password = password;
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

    static checkUser(username, password){
        return users.find(user => user.username == username && user.password == password);
    }

    removeItem(itemId){
        return this.cart.removeItem(itemId);
    }

    updateQty(itemId, newQty){
        return this.cart.updateQty(itemId, newQty)
    }

}
