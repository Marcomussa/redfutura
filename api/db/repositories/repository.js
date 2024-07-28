const handleMongoError = require('../utils/handleMongoError');

const { ProductModel } = require('../models/product.model');
const { SupplierModel } = require('../models/supplier.model');
const { MemberModel } = require('../models/member.model');

class Repository {
  BaseModel;
  modelName;

  constructor(mongooseModel) {
    this.BaseModel = mongooseModel;
    this.modelName = this.BaseModel.modelName;
  }

  async findById(objectId, options) {
    let obj;

    try {
      obj = await this.BaseModel.findById(objectId).select(options?.fields).populate(options?.populate);
    } catch (error) {
      handleMongoError(error)
      obj = null;
    }

    if (!obj) {
      throw new Error(`${this.modelName} with id ${objectId} does not exist`);
    }

    return obj;
  }

  async findByName(name) {
    return this.BaseModel.aggregate([
      { $match: { $text: { $search: name } } },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplier'
        }
      }
    ]);
  }

  async findMany(filter, options) {
    let objs;
    try {
      objs = await this.BaseModel.find(filter).populate(options?.populate)
    } catch (error) {
      objs = [];
    }

    return objs;
  }

  async create(object) {
    const dbObj = new this.BaseModel(object);

    try {
      await dbObj.save();
    } catch (error) {
      handleMongoError(error);
      throw new Error(error.message ?? `There was an error while creating the ${this.modelName}`);
    }

    return dbObj;
  }

  async deleteById(objectId) {
    try {
      const deletedObject = await this.BaseModel.findByIdAndDelete(objectId);
      return deletedObject;
    } catch (error) {
      handleMongoError(error);
      throw new Error(`There was an error while deleting the ${this.modelName}`);
    }
  }

  async updateById(objectId, updateData, returnNew) {
    let dbObj;

    try {
      dbObj = await this.BaseModel.findByIdAndUpdate(
        objectId,
        { $set: updateData },
        {
          new: returnNew ?? false,
          runValidators: true
        }
      ).lean();
    } catch (error) {
      handleMongoError(error);
      throw new Error(`There was an error while updating the ${this.modelName}`);
    }

    if (!dbObj) {
      throw new Error(`${this.modelName} with id ${objectId} does not exist`);
    }
    return dbObj;
  }
}

module.exports = Repository;