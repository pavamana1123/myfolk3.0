const axios = require('axios')
const mysql = require('mysql')
const fs = require('fs')


function generateInsertQueries(data){
  var queries = []
  for (const tableName in data) {
    queries = queries.concat(generateInsertStatements(tableName, data[tableName]))
  }
  return queries
}

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

async function getSyncData() {
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

function getQueries(data){
  var data1 = JSON.parse(JSON.stringify(data))
  return generateDeleteQueries(data)
  .concat(generateInsertQueries(data))
  .concat(generateRoleQueries(data1))
}

function generateRoleQueries(data){
  return [
    `DELETE FROM iskconmy_folk.roles;`,
    `INSERT INTO iskconmy_folk.roles (username, roleIndex, roleID, roleName) VALUES ('pvpd', 0, 'FG', 'FOLK Guide');`,
    `INSERT INTO iskconmy_folk.roles (username, roleIndex, roleID, roleName) VALUES ('skkd', 0, 'FG', 'FOLK Guide');`
  ].concat(data.participants.filter(p=>{
    return p.buddy == 'Core'
  }).map(p=>{
    return `INSERT INTO iskconmy_folk.roles (username, roleIndex, roleID, roleName) VALUES ('${p.name.toLowerCase().replace(/\s/g, '')}', 1, 'Core', 'Core');`
  }))
}

const sync = {
  getSyncData,
  getQueries
}


module.exports = sync

