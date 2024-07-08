const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0
    },
    sku: {
      type: String,
      required: [true, 'Product sku is required']
    }
  },
  { timestamps: false, versionKey: false });

const ProductModel = model('Product', ProductSchema);

module.exports = ProductModel;