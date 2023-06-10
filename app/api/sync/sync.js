
function generateInsertStatements(tableName, entries) {
  const insertStatements = [];

  for (const entry of entries) {
    const columns = [];
    const values = [];

    // Handle exceptions for the "participants" table
    if (tableName === 'participants') {
      const username = entry.name.toLowerCase().replace(/\s/g, '');
      entry.buddy = entry.buddy === 'Core' || entry.buddy === '-' ? null : entry.buddy.toLowerCase().replace(/\s/g, '');
      const pass = '';
      entry.preacher = entry.preacher.toLowerCase().replace(/\s/g, '');

      columns.push(`${tableName}.username`, `${tableName}.pass`);
      values.push(username, pass);
    }

    // Handle exceptions for the "registrations" table
    if (tableName === 'registrations') {
      entry.name = entry.name === '#N/A' ? null : entry.name;
      const username = entry.name === null ? null : entry.name.toLowerCase().replace(/\s/g, '');

      columns.push(`${tableName}.username`);
      values.push(username);
    }

    // Handle exceptions for the "participation" table
    if (tableName === 'participation') {
      entry.name = entry.name === '#N/A' ? null : entry.name;
      entry.remarks = Buffer.from(entry.remarks).toString('base64');
      const username = entry.name === null ? null : entry.name.toLowerCase().replace(/\s/g, '');
      entry.caller = (entry.caller||"").toLowerCase().replace(/\s/g, '');

      columns.push(`${tableName}.username`);  
      values.push(username);
    } 

    for (const column in entry) {
      columns.push(`${tableName}.${column}`);
      values.push(entry[column]);
    }

    const columnString = columns.join(', ');
    const valueString = values.map(value => {
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }else if(value===null){
        return "null"
      }
      return value;
    }).join(', ');

    const insertStatement = `INSERT INTO ${tableName} (${columnString}) VALUES (${valueString});`;
    insertStatements.push(insertStatement);
  }

  return insertStatements;
}

function generateDeleteQueries(data) {
  const deleteQueries = [];

  for (const tableName in data) {
    const deleteQuery = `DELETE FROM iskconmy_folk.${tableName};`;
    deleteQueries.push(deleteQuery);
  }

  return deleteQueries;
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

    var delQ = generateDeleteQueries(tables)
    insertStatements = delQ.concat(insertStatements)

    const fs = require('fs');

    try {
    fs.writeFileSync('sync.sql', insertStatements.join(`
`));
        console.log('String successfully written to sync.sql');
    } catch (err) {
        console.error('Error writing to file:', err);
    }

//     executeMultipleStatementQuery(insertStatements.join(`
// `))
//     .then(results => {
//         console.log('Sync complete');
//     })
//     .catch(error => {
//         console.error('Error executing the query:', error);
//     });
  })
  .catch(error => {
    console.error('Something went wrong:', error);
  });
