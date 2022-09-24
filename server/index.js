const express = require("express")
const {graphqlHTTP} = require("express-graphql");
const schema = require('./schema/schema');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const connectDB = require("./config/db");
const cors = require('cors');


 


//Connect to database 
connectDB();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development'

}))
app.listen(port, ()=>{
  console.log(`The serve is running on port ${port} `)
});



