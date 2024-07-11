const { connect } = require("mongoose");

const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@redfutura.ny4nxp2.mongodb.net/?retryWrites=true&w=majority&appName=RedFutura`;

const connectToDB = async (app, port) => {
  connect(MONGODB_URI)
    .then(() => {
      console.log(`Listening on port ${port}...`)
      app.listen(port)
    })
    .catch((error) => console.log('Error while connecting to DB: ', error))
};

module.exports = connectToDB;