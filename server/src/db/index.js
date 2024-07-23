const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

mongoose.connect(URI).then(()=> console.log(`Database connected successfully`))
.catch((error) => console.log(`Error while connecting to database`, error));

const connection = () => {
    mongoose.connection.on("connected", function (err) {
      if (err) {
        console.log("Mongoose default connection error: " + err);
      } else {
        console.log("Mongoose connected!");
      }
  
    });
  };

module.exports = {connection};


