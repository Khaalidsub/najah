
const Cart = require('../models/cart')
const MerchandiseDA = require('./MerchandiseDA')

const addToCart = async (id, userId) => {
    const foundCart = await Cart.findOne({ customer: userId });
    isthere = false;
    //if there is a cart for the user, check if the item he is trying to add is there alredy
    //this is to group the elements .
    if (foundCart) {
        for (var val of foundCart.items) {
            if (val['item'] == id) {
                await foundCart.populate('items.item').execPopulate();
                isthere = true;
                foundCart.totalPrice += val.item.price;
                val.price += val.item.price;
                val.quantity++;
                foundCart.totalItems++;
                await foundCart.save();
                //break;
            }
        }

        if (isthere == false) {
            const product = await MerchandiseDA.merchandisePriceById(id); // to get the price
            foundCart.totalPrice += product.price;
            item = { item: id, price: product.price };
            item.quantity = 1;
            foundCart.totalItems++;

            //console.log(item);
            foundCart.items.push(item);
            await foundCart.save();
            //localStorage.getItem();
        }
    } else {
        //create the new cart for the customer carting first time
        return await handleNewCart(id, userId)
    }

    return foundCart;
}

handleNewCart = async (id, userId) => {
    const cart = new Cart();
    const Product = await MerchandiseDA.merchandisePriceById(id) //getting the price

    cart.totalItems = 1;
    cart.totalPrice = Product.price; //change later
    item = { item: id, price: Product.price };
    item.quantity = 1;
    item.item = id;
    cart.customer = userId;
    cart.items.push(item);
    await cart.save(); //document method
    //localStorage.setItem();
    return cart;
}

module.exports = {
    addToCart: addToCart
}