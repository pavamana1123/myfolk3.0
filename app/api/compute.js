async function getAttendance(db, username) {
    try {
      const query = `SELECT COUNT(*) AS total FROM participation WHERE username = '${username}' AND attendance = TRUE`;
      const result = await db.execQuery(query);
      return result[0].total;
    } catch (error) {
      console.error('Error occurred while retrieving total classes attended:', error);
      throw error;
    }
}

async function getProgramAttendance(db, program, username) {
    try {
      const query = `
        SELECT COUNT(*) AS total
        FROM participation AS p
        JOIN calendar AS c ON p.eventId = c.eventId
        WHERE c.program = '${program}' AND p.username = '${username}' AND p.attendance = TRUE
      `;
      const result = await db.execQuery(query);
      return result[0].total;
    } catch (error) {
      console.error('Error occurred while retrieving program attendance:', error);
      throw error;
    }
}
  
  


const compute = (username)=>{

}



module.exports = compute