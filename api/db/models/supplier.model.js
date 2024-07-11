const { Schema, model } = require('mongoose');

const SupplierSchema = new Schema(
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
    }
  },
  { timestamps: false, versionKey: false });

const SupplierModel = model('Supplier', SupplierSchema);

module.exports = SupplierModel;