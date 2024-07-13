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
      obj = await this.BaseModel.findById(objectId).select(options?.fields).populate(options?.populate).lean();
    } catch (error) {
      handleMongoError(error)
      obj = null;
    }

    if (!obj) {
      throw new Error(`${this.modelName} with id ${objectId} does not exist`);
    }

    return obj;
  }

  async findMany(filter) {
    let objs;
    try {
      objs = await this.BaseModel.find(filter)
    } catch (error) {
      console.log(`WARNING: There was an error while finding ${this.modelName}s`);
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
      await this.BaseModel.findByIdAndDelete(objectId);
    } catch (error) {
      handleMongoError(error);
      throw new Error(`There was an error while deleting the ${this.modelName}`);
    }
  }

  async updateById(object) {
    const { _id: objectId, ...obj } = object;
    let dbObj;

    try {
      dbObj = await this.BaseModel.findByIdAndUpdate(objectId, obj, {
        new: true,
        runValidators: true
      }).lean();
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