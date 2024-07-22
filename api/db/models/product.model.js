const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
      trim: true
    },
    imageId: {
      type: String,
      required: [true, 'Product image is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      uppercase: true
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
      uppercase: true
    },
    article: {
      type: String,
      required: [true, 'Product article is required'],
      trim: true,
      uppercase: true
    },
    model: {
      type: String,
      required: [true, 'Product model is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'Product sku is required'],
      trim: true
    },
    eanCode: {
      type: String,
      required: [true, 'Product code ean is required'],
      trim: true
    },
    description: {
      type: String
    },
    cost: {
      type: Number,
      min: 0,
      required: [true, 'Product cost is required']
    },
    price: {
      type: Number,
      min: 0,
      required: [true, 'Product price is required']
    },
    supplier: {
      type: Schema.Types.ObjectId,
      required:[true, 'Product supplier is required'],
      ref: 'Supplier'
    },
    section: {
      type: String,
      required: [true, 'Product section is required'],
      trim: true
    }
  },
  { timestamps: false, versionKey: false });

ProductSchema.index({ name: 'text' })

const ProductModel = model('Product', ProductSchema);

module.exports = ProductModel;