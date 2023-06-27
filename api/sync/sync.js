const axios = require('axios')
const mysql = require('mysql')
const fs = require('fs')

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "iskconmy_folk"
})

connection.connect((err)=>{
  if(err){
    throw err
  }
})

function generateInsertStatements(tableName, entries) {
  const insertStatements = []

  for (const entry of entries) {
    const columns = []
    const values = []

    // Handle exceptions for the "participants" table
    if (tableName === 'participants') {
      const username = entry.name.toLowerCase().replace(/\s/g, '')
      entry.buddy = entry.buddy === 'Core' || entry.buddy === '-' ? null : entry.buddy.toLowerCase().replace(/\s/g, '')
      const pass = ''
      entry.preacher = entry.preacher.toLowerCase().replace(/\s/g, '')

      columns.push(`${tableName}.username`, `${tableName}.pass`)
      values.push(username, pass)
    }

    // Handle exceptions for the "registrations" table
    if (tableName === 'registrations') {
      entry.name = entry.name === '#N/A' ? null : entry.name
      const username = entry.name === null ? null : entry.name.toLowerCase().replace(/\s/g, '')

      columns.push(`${tableName}.username`)
      values.push(username)
    }

    // Handle exceptions for the "participation" table
    if (tableName === 'participation') {
      entry.name = entry.name === '#N/A' ? null : entry.name
      entry.remarks = Buffer.from(entry.remarks).toString('base64')
      const username = entry.name === null ? null : entry.name.toLowerCase().replace(/\s/g, '')
      entry.caller = (entry.caller||"").toLowerCase().replace(/\s/g, '')

      columns.push(`${tableName}.username`)  
      values.push(username)
    } 

    for (const column in entry) {
      columns.push(`${tableName}.${column}`)
      values.push(entry[column])
    }

    const columnString = columns.join(', ')
    const valueString = values.map(value => {
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`
      }else if(value===null){
        return "null"
      }
      return value
    }).join(', ')

    const insertStatement = `INSERT INTO ${tableName} (${columnString}) VALUES (${valueString})`
    insertStatements.push(insertStatement)
  }

  return insertStatements
}

function generateDeleteQueries(data) {
  const deleteQueries = []

  for (const tableName in data) {
    const deleteQuery = `DELETE FROM iskconmy_folk.${tableName}`
    deleteQueries.push(deleteQuery)
  }

  return deleteQueries
}

async function makePostRequest() {
  try {
    const url = 'https://vol.iskconmysore.org/api'
    const body = { func: 'syncFOLK' }

    console.log(new Date(), `Fetching data`)
    const response = await axios.post(url, body)
    console.log(new Date(), `Data received`)
    return response.data
  } catch (error) {
    console.error('An error occurred:', error.response.data)
    throw error
  }
}

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results, fields) => {
      if (err) {
        reject(err)
        return
      }
      resolve(results)
    })
  })
}

// Example usage
makePostRequest()
  .then(async apiResponse => {
    var insertStatements = []
    var tables = apiResponse.data
    for (const tableName in tables) {
        const tableEntries = tables[tableName]
        insertStatements = insertStatements.concat(generateInsertStatements(tableName, tableEntries))
    }

    var delQ = generateDeleteQueries(tables)
    insertStatements = delQ.concat(insertStatements)

    var errors = []

    console.log(new Date(), `Sync began`)
    for(var i=0; i<insertStatements.length; i++){
      let s = insertStatements[i]
      try {
        await executeQuery(s)
      } catch(e){
        errors.push({
          query: s,
          error: e
        })
      }
    }
    console.log(new Date(), `Sync completed`)

    if(errors.length){
      console.log(`Errors: ${JSON.stringify(errors, null, 2)}`)
    }

    connection.end((err) => {
      if (err) {
        throw err
      }
    })
  })
  .catch(error => {
    console.error('Something went wrong:', error)
  })
