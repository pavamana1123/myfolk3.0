const sync = require("./sync.js")
const axios = require('axios')

function newError(code, msg){
  return { code, msg }
}

async function login(req, res, db){
    try {
      const { phone, password } = req.body

      let query = `SELECT * FROM participants WHERE phone = '${phone}'`
      let result = await db.execQuery(query)
      if (result.length == 0) {
        query = `SELECT * FROM users WHERE phone = '${phone}'`
        result = await db.execQuery(query)
        if(result.length == 0) {
          return newError(404, "User does not exist")
        }
      }

      var user = {
        username: result[0].username,
        name: result[0].name,
        phone: result[0].phone,
        roleInfo: []
      }

      if (result[0].pass == password) {
        query = `SELECT * FROM roles WHERE username='${user.username}'`
        result = await db.execQuery(query)
        if (result.length > 0) {
          user.roleInfo = result.map(r=>{
            return {
              roleName: r.roleName,
              roleID: r.roleID,
              roleIndex: r.roleIndex
            }
          }).sort((r1, r2)=>{
            return r1.roleIndex-r2.roleIndex
          })
        }
  
        res.status(200).json(user)
      } else {
        return newError(403, "Invalid password")
      }

    } catch (error) {
      console.error("Login error:", error)
      return newError(500, "Internal server error")
    }
}

async function buddies(req, res, db){

  const username = req.get("username")
  try {
    let query = `SELECT * FROM roles WHERE username = '${username}' order by roleIndex limit 1`
    let result = await db.execQuery(query)

    if (result.length > 0) {

        var role = result[0]
        switch(role.roleID){
          case "FG":
            query=`select * from participants
            join compute on compute.username=participants.username
            order by compute.activeness`
            break
          case "Core":
            query=`select * from participants
            join compute on compute.username=participants.username
            where participants.buddy="${username}"
            order by compute.activeness`
            break
          default:
            return newError(404, "Unauthorized")
        }

        let buddies = await db.execQuery(query)
        res.status(200).json(buddies)
    } else {
      return newError(404, "Unauthorized")
    }
  } catch (error) {
    console.error("Login error:", error)
    return newError(500, `Internal server error: ${error}`)
  }
}

async function datasync(req, res, db){
  sync.getSyncData()
  .then(async resp => {
    var queries = sync.getQueries(resp.data)
    var errors = []

    console.log(new Date(), `Sync began`)

    for(var i=0; i<queries.length; i++){
      try {
        await db.execQuery(queries[i])
      } catch(e){
        errors.push({
          query: queries[i],
          error: e
        })
      }
    }
    console.log(new Date(), `Sync completed`)
    res.status(200).json(errors)
  })
  .catch(error => {
    return newError(404, error)
  })
}

async function sendOtp(req, res, db){
  var { phone, email, id } = req.body
  var result = {}
  try {
    let query = `select * from
    (SELECT username, phone, email FROM users
    union
    SELECT username, phone, email FROM participants) as t
    where t.${phone?'phone':'email'}='${phone?phone:email}';`
    result = await db.execQuery(query)
    if(result.length == 0) {
      return newError(404, "User does not exist")
    }
  }catch(e){
    return newError(500, e)
  }
  
  axios.post('https://otp.iskconmysore.org/data', { id, email, phone }, {
    headers: {
      'endpoint': '/send',
      'Content-Type': 'application/json'
    }
  })
    .then(() => {
      res.status(200).send({
        username: result[0].username
      })
    })
    .catch(error => {
      return newError(error.response.status, error)
    })
}

async function verifyOtp(req, res, db){
  var { otp , id } = body
  
  axios.post('https://otp.iskconmysore.org/data', {
    id, otp
  }, {
    headers: {
      'endpoint': '/verify',
      'Content-Type': 'application/json'
    }
  })
    .then(() => {
      res.status(200).send()
    })
    .catch(error => {
      return newError(error.response.status, error)
    })
}

async function resetPass(req, res, db){
  try {
    const { username, password } = req.body

    let query = `UPDATE participants
      SET pass = '${password}'
      WHERE username = '${username}';`
    let result = await db.execQuery(query)

    if(result.affectedRows){
      res.status(200).send()
      return
    }

    query = `UPDATE users
    SET pass = '${password}'
    WHERE username = '${username}';`
    result = await db.execQuery(query)

    if(result.affectedRows){
      res.status(200).send()
      return
    }else{
      return newError(404, "username not found")  
    }

  } catch (error) {
    console.error("Login error:", error)
    return newError(500, "Internal server error")
  }
}



class API {
    constructor(db){
        this.db = db
        this.apimap = {
          '/login': login,
          '/buddies': buddies,
          '/datasync': datasync,
          '/send-otp': sendOtp,
          '/verify-otp': verifyOtp,
          '/reset-pass': resetPass,
        }
    }

    async call(req, res) {

      var endpoint = req.get("endpoint")
      console.log(`api - ${req.get("endpoint")}`)

      if(this.apimap[endpoint]){
        var err = await (this.apimap[endpoint])(req, res, this.db)
        if(err){
          this.sendError(res, err.code, err.msg)
        }
      }else{
        this.sendError(res, 404, "Invalid endpoint")
      }
  }

  sendError(res, code, msg){
      res.status(code)
      res.send({"error":msg})
  }
}

module.exports = API