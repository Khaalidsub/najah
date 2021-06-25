const Merchandise = require('../models/Merchandise')
const mongoose = require('mongoose')


addMerchandise = async function (merchandise) {
    console.log("this was executed")
    try {
        await merchandise.save()

    } catch (error) {
        return null
    }

}
fetchMerchandise = async function (role) {
    var values
    try {
        if (role == 'user') {
            values = await Merchandise.find({ status: 'available' });
        } else {
            values = await Merchandise.find()
        }
        if (values.length > 0) {
            return values
        } else
            throw new Error();
    } catch (e) {
        return null
    }
}

merchandisePriceById = async (id) => {
    return await Merchandise.findById(id, 'price');
}

deleteMerchandise = async function (id) {
    try {
        const item = await Merchandise.findById(id)
        item.remove();//remove is used to trigger middleware!
        return item

    } catch (error) {
        return null
    }

}

module.exports = {
    addMerchandise: addMerchandise,
    fetchMerchandise: fetchMerchandise,
    deleteMerchandise: deleteMerchandise,
    merchandisePriceById: merchandisePriceById
}