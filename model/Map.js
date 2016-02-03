var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mapSchema = new Schema({
    name: { 
        type: String,
        required: true,
        unique: true 
    },
    paths: {
        type: Array,
        required: false 
    }
});

module.exports = mongoose.model('maps', mapSchema);