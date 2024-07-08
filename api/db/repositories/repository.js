class Repository {
  BaseModel;
  modelName;

  constructor(mongooseModel) {
    this.BaseModel = mongooseModel;
    this.modelName = this.BaseModel.modelName;
  }
}

module.exports = Repository;