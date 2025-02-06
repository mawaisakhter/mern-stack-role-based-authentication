const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname:{
        type: String,
        required: true,
    },
    productcontent:{
        type: String,
        required: true,
    },
    productprice:{
        type: Number,
        required: true,
    },
    multipleimages:[
        {
            type: String,
            required: true,
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
});

module.exports = mongoose.model('Product', productSchema);