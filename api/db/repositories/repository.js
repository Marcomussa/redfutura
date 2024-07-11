class Repository {
  BaseModel;
  modelName;

  constructor(mongooseModel) {
    this.BaseModel = mongooseModel;
    this.modelName = this.BaseModel.modelName;
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
}

module.exports = Repository;