const mongoose = require('mongoose')


async function connectToDB(){
  
  const connectionString = process.env.MONGODB_URI

  let isConnected = false;

  if (!connectionString) return console.log(connectionString)

  mongoose.set('strictQuery', false)

  if (isConnected) return console.log("Already connected to DB");


  try {
    
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true },)
    isConnected = true;

  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

module.exports = connectToDB