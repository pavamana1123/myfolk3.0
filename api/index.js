const express = require('express')
const app = express()
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