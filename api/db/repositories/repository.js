class Repository {
  BaseModel;
  modelName;

  constructor(mongooseModel) {
    this.BaseModel = mongooseModel;
    this.modelName = this.BaseModel.modelName;
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
}

module.exports = Repository;