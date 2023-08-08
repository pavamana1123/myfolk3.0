const express = require('express')
const app = express()

const sync = require("./sync.js")
const compute = require("./compute.js")


app.use(express.json()) 
const port = 3005

const API  = require("./api.js")
var cred = require("./cred.js")
const DB = require("./db.js")

cred.mysql.connectionLimit = 100
cred.mysql.multipleStatements = true

var mysql = require('mysql');
var db = new DB(mysql.createPool(cred.mysql))

const api = new API(db)
app.post('/api', api.call.bind(api))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


function isMidnight() {
  const now = moment();
  const startTime = moment().hour(1).minute(0).second(0);
  const endTime = moment().hour(1).minute(59).second(59);

  return now.isBetween(startTime, endTime);
}

setInterval(async () => {

  if(!isMidnight()){
    return
  }

  try {
    await sync.exec(db)
  }catch(e){
    console.log("Sync error:", e)
  }

  try {
    await compute.exec(db)
  }catch(e){
    console.log("Compute error:", e)
  }
}, 1000*60*60);