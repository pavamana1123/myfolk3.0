const moment = require('moment');

class Compute {
  constructor(db) {
    this.db = db;
  }

  async computeAttendance(username) {
      try {
        const query = `SELECT COUNT(participation.eventId) AS total FROM participation
        join  calendar on calendar.eventId=participation.eventId
        join  programs on programs.id=calendar.program
        WHERE username = '${username}' AND attendance = TRUE and programs.type='Session'`;
        const result = await db.execQuery(query);
        return result[0].total;
      } catch (error) {
        console.error('Error occurred while retrieving total classes attended:', error);
        throw error;
      }
  }

  async computeProgramAttendance(program, username) {
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

  async computeLastSeen(username) {
    try {
      const query = `
        SELECT ceil(datediff(curdate(), max(date))/7) AS lastSeen
        FROM participation
        join calendar on calendar.eventId=participation.eventId
        WHERE username = '${username}' AND attendance = TRUE
      `;
      const result = await this.db.execQuery(query);
      const lastSeen = result[0].lastSeen;
      return lastSeen !== null ? lastSeen : null;
    } catch (error) {
      console.error('Error occurred while retrieving last seen:', error);
      throw error;
    }
  }

  async computeRegularity(username) {
    try {
      const query = `
        select count(*)/4 as regularity from (select participation.eventId, attendance from participation
        join calendar on calendar.eventId=participation.eventId
        where username='${username}'
        order by calendar.date desc
        limit 4) as t where attendance=1
      `;
      const result = await this.db.execQuery(query);
      return result[0].regularity;
    } catch (error) {
      console.error('Error occurred while calculating recent regularity:', error);
      throw error;
    }
  }

  async computeInvites(username) {
    try {
      const query = `
        select count(*) as invites from participation where username='${username}'
      `;
      const result = await this.db.execQuery(query);
      const invites = result[0].invites;
      return invites !== null ? invites : null;
    } catch (error) {
      console.error('Error occurred while calculating recent regularity:', error);
      throw error;
    }
  }

  async computeRegistered(username) {
    try {
      const query = `
        select paid from registrations where username='${username}' and program = (select program from participants where username='${username}')
      `;
      const result = await this.db.execQuery(query);
      if(result.length==0){
        return false
      }
      return result[0].paid
    } catch (error) {
      console.error('Error occurred while calculating recent regularity:', error);
      throw error;
    }
  }

  async getParticipantDetails(username) {
    try {
      const query = `
        select * from participants
        where username='${username}'
      `;
      const result = await this.db.execQuery(query);
      return result[0]
    } catch (error) {
      console.error('Error occurred while calculating recent regularity:', error);
      throw error;
    }
  }

  async getParticipants(username) {
    try {
      const query = `
        select username from participants
      `;
      const result = await this.db.execQuery(query);
      return result.map(r=>{
        return r.username
      })
    } catch (error) {
      console.error('Error occurred while calculating recent regularity:', error);
      throw error;
    }
  }

  async computeStatus(username, attendance, lastSeen, regularity){
    const participant = await this.getParticipantDetails(username)
    if(participant.category!="General"){
      return "NA"
    }
    if(participant.snoozeDate>moment().format("YYYY-MM-DD")){
      return "Snoozed"
    }
    if(regularity>=0.75){
      return "Regular"
    }
    const registered = await this.computeRegistered(username)
    const invites = await this.computeInvites(username)
    if(attendance==0){
      if(registered){
        if(invites==0){
          return "New"
        }
        if(invites<4){
          return "Follow-Up"
        }
        return "Non-Responsive"
      }else{
        if(invites<4){
          return "Follow-Up"
        }
        return "Non-Responsive"
      }
    }
    if(invites<4){
      return "Beginner"
    }
    if(regularity<0.75 && regularity>0){
      return "Irregular"
    }
    if(lastSeen<8){
      return "Dropping-Out"
    }
    if(attendance>16){
      return "Long-Absence"
    }
    return "Dropped-Out"
  }

  computeQuery(data) {
    const table = 'compute';
    const columns = Object.keys(data).map(k=>{
      return `${table}.${k}`
    });
    const values = Object.values(data).map(v=>{
      if(typeof(v)=='string'){
        return `'${v}'`
      }
      if(v===null){
        return 'null'
      }
      return v
    });
  
    // Prepare the INSERT statement
    let sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(", ")}) `;
  
    // Prepare the ON DUPLICATE KEY UPDATE clause
    const updateClause = columns.map((column) => `${column}=VALUES(${column})`).join(', ');
    sql += `ON DUPLICATE KEY UPDATE ${updateClause};`;

    return sql
  }

  async compute(username){
    try {
      const attendance = await this.computeAttendance(username)
      const sosAttendance = await this.computeProgramAttendance("SOS" ,username)
      const folk2Attendance = await this.computeProgramAttendance("FOLK2" ,username)
      const folk4Attendance = await this.computeProgramAttendance("FOLK4" ,username)
      const lastSeen = await this.computeLastSeen(username)
      const regularity = await this.computeRegularity(username)
      const status = await this.computeStatus(username, attendance, lastSeen, regularity)
  
      const activenessMap = {
        "Regular": 0,
        "Irregular": 1,
        "Beginner": 2,
        "Dropping-Out": 3,
        "Long-Absence": 4,
        "Non-Responsive": 5,
        "Follow-Up": 6,
        "New": 7,
        "Dropped-Out": 8,
        "Snoozed": 9,
        "NA": 10,
      }
      const activeness = activenessMap[status]
      const query = this.computeQuery({username, attendance, sosAttendance, folk2Attendance, folk4Attendance, lastSeen, regularity, status, activeness})
      await this.db.execQuery(query);
    }catch(e){
      console.log('compute:', e)
      throw e
    }
  }

  async computeAll(){
    try{
      var p = await this.getParticipants()
    
      for(var i=0; i<p.length; i++){
        await this.compute(p[i])
      }
      console.log("Computed for", p.length, "participants")
    }catch(e){
      console.log('compute all', e)
      throw e
    }
  }
}

var cred = require("./cred.js")
const DB = require("./db.js")

cred.mysql.connectionLimit = 100
cred.mysql.multipleStatements = true

var mysql = require('mysql');
var db = new DB(mysql.createPool(cred.mysql))

new Compute(db).computeAll()

module.exports = Compute