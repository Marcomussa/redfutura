const { Schema, model } = require('mongoose');

const MemberSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Supplier image is required'],
      trim: true
    },
    imageId: {
      type: String,
      required: [true, 'Supplier image is required'],
      trim: true
    },
    businessName: {
      type: String,
      required: [true, 'Member business name is required'],
      trim: true,
      uppercase: true
    },
    fantasyName: {
      type: String,
      required: [true, 'Member fantasy name is required'],
      trim: true,
      uppercase: true
    },
    address: {
      type: String,
      required: [true, 'Member address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Member city is required'],
      trim: true,
      uppercase: true
    },
    province: {
      type: String,
      required: [true, 'Member province is required'],
      trim: true,
      uppercase: true
    },
    postalCode: {
      type: Number,
      required: [true, 'Member postal code is required'],
    },
    section: {
      type: String,
      required: [true, 'Member section is required'],
      trim: true
    }
  },
  { timestamps: false, versionKey: false });

const MemberModel = model('Member', MemberSchema);

module.exports = MemberModel;