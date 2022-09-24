 const mongoose = require('mongoose');
 const connectDB = async () => {
const conn = await mongoose.connect(process.env.MONGOBD_URL )

  console.log(`MongoDB Connected: ${conn.connection.host}`)
 };
 module.exports = connectDB; 