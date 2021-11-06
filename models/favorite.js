const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const favoriteSchema = new Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]

});


var Favorites = mongoose.model('favorite', favoriteSchema);

module.exports = Favorites;