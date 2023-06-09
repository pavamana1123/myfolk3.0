
function generateInsertStatements(tableName, entries) {
    const insertStatements = [];
  
    for (const entry of entries) {
      const columns = Object.keys(entry);
      const values = Object.values(entry);
  
      // Handle exceptions for the "participants" table
      if (tableName === 'participants') {
        const username = entry.name.toLowerCase().replace(/\s/g, '');
        const callNotAvailable = 0;
        const whatsAppNotAvailable = 0;
        const addedBy = entry.buddy.toLowerCase().replace(/\s/g, '');
        const pass = '';
        const preacher = entry.preacher.toLowerCase().replace(/\s/g, '');
  
        columns.push('username', 'callNotAvailable', 'whatsAppNotAvailable', 'addedBy', 'pass', 'preacher');
        values.push(username, callNotAvailable, whatsAppNotAvailable, addedBy, pass, preacher);
      }

    // Handle exceptions for the "registrations" table
    if (tableName === 'registrations') {
        const username = entry.name === '#N/A' ? null : entry.name.toLowerCase().replace(/\s/g, '');
        const meta = null;
  
        columns.push('username', 'meta');
        values.push(username, meta);
    }
  
      const columnString = columns.

join(', ');
      const valueString = values.map(value => {
        if (typeof value === 'string') {
          return `'${value}'`;
        }
        return value;
      }).join(', ');
  
      const updateString = columns.map(column => {
        return `${column} = VALUES(${column})`;
      }).join(', ');
  
      const insertStatement = `INSERT INTO ${tableName} (${columnString}) VALUES (${valueString}) ON DUPLICATE KEY UPDATE ${updateString};`;
      insertStatements.push(insertStatement);
    }
  
    return insertStatements;
}
  
const axios = require('axios');

async function makePostRequest() {
  try {
    const url = 'https://vol.iskconmysore.org/api';
    const body = { func: 'syncFOLK' };

    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error('An error occurred:', error.response.data);
    throw error;
  }
}

const mysql = require('mysql');

function executeMultipleStatementQuery(query) {
  return new Promise((resolve, reject) => {
    // Create a connection to the MySQL database
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "iskconmy_folk"
    });

    // Connect to the database
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log('Connected to the database');

      // Execute the multiple statement query
      connection.query(query, (err, results, fields) => {
        if (err) {
          reject(err);
          return;
        }

        // Close the database connection
        connection.end((err) => {
          if (err) {
            reject(err);
            return;
          }

          console.log('Database connection closed');

          resolve(results);
        });
      });
    });
  });
}


// Example usage
makePostRequest()
  .then(apiResponse => {
    var insertStatements = []
    var tables = apiResponse.data
    for (const tableName in tables) {
        const tableEntries = tables[tableName];
        insertStatements = insertStatements.concat(generateInsertStatements(tableName, tableEntries))
    }

    const fs = require('fs');

    try {
    fs.writeFileSync('sync.sql', insertStatements.join(`;
`));
        console.log('String successfully written to sync.sql');
    } catch (err) {
        console.error('Error writing to file:', err);
    }

    executeMultipleStatementQuery(insertStatements.join("; "))
    .then(results => {
        console.log('Sync complete');
    })
    .catch(error => {
        console.error('Error executing the query:', error);
    });
  })
  .catch(error => {
    console.error('Something went wrong:', error);
  });
