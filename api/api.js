const func = require("./func.js")

class API {
    constructor(db){
        this.db = db
        this.apimap = {
          '/login': func.login,
          '/buddies': func.buddies,
          '/datasync': func.datasync,
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