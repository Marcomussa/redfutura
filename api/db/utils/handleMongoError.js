const { Error } = require("mongoose");

const DUPLICATE_VALUE_ERROR_CODE = 11000;

const handleMongoError = (error) => {
  if (error.code === DUPLICATE_VALUE_ERROR_CODE) {
    throw new Error(`Duplicate key value: ${error.keyValue}`);
  }

  if (error instanceof Error.ValidationError) {
    throw new Error(error.message);
  }
};

module.exports = handleMongoError;