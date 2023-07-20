const sync = require("./sync.js")

function newError(code, msg){
  return { code, msg }
}

async function login(req, res, db){
    try {
      const { phone, username, password } = req.body
  
      let users = null
      let userDetails = null
  
      let query = `SELECT * FROM participants WHERE ${phone?"phone":"username"} = '${phone?phone:username}'`
      let result = await db.execQuery(query)
  
      if (result.length > 0) {
        users = result
        userDetails = {
          username: user.username,
          name: user.name,
          phone: user.phone,
          roleInfo: []
        }
      } else {
        query = `SELECT * FROM users WHERE ${phone?"phone":"username"} = '${phone?phone:username}'`
        result = await db.execQuery(query)
  
        if (result.length > 0) {
          user = result[0]
          userDetails = {
            username: user.username,
            name: user.name,
            phone: user.phone,
            roleInfo: []
          }
        }
      }
  
      if (user) {
        if (user.reduce((match, u)=>{
          return match || u.pass == password
        }, false)) {
          query = `SELECT * FROM roles WHERE username='${user.username}'`
          result = await db.execQuery(query)
  
          if (result.length > 0) {
            const roleInfo = result
            userDetails.roleInfo = roleInfo.map(r=>{
              return {
                roleName: r.roleName,
                roleID: r.roleID,
                roleIndex: r.roleIndex
              }
            }).sort((r1, r2)=>{
              return r1.roleIndex-r2.roleIndex
            })
          }
  
          res.status(200).json(userDetails)
        } else {
          return newError(403, "Invalid password")
        }
      } else {
        return newError(404, "User does not exist")
      }
    } catch (error) {
      console.error("Login error:", error)
      return newError(500, "Internal server error")
    }
}

async function buddies(req, res){

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

async function datasync(req, res){
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

class API {
    constructor(db){
        this.db = db
        this.apimap = {
          '/login': login,
          '/buddies': buddies,
          '/datasync': datasync,
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