var cred = require("./cred.js")

class API {
    constructor(db){
        this.db = db
    }

    async call(req, res) {

        var {body} = req
        var self = this
        console.log(`api - ${req.get("endpoint")}`)
        
        switch(req.get("endpoint")){

            case '/login':
                try {
                  const { phone, password } = body
              
                  // Check if the phone number exists in the participants table
                  const participantsQuery = `SELECT * FROM participants WHERE phone='${phone}'`
                  const participantsResult = await this.db.execQuery(participantsQuery)
              
                  // Check if the phone number exists in the roles table
                  const rolesQuery = `SELECT * FROM roles WHERE phone='${phone}'`
                  const rolesResult = await this.db.execQuery(rolesQuery)
              
                  if (participantsResult.length === 0 && rolesResult.length === 0) {
                    // User does not exist
                    this.sendError(res, 404, "User does not exist")
                  } else {
                    // User exists, check the password
                    const user = participantsResult.length > 0 ? participantsResult[0] : rolesResult[0]
                    const storedPassword = user.pass // Assuming the password is stored in a column named 'pass'
              
                    // Compare the provided password with the stored password (assuming the password is already hashed)
                    if (password === storedPassword) {
                      // Password is correct, return all details of the entry
                      const userDetails = {
                        participants: participantsResult || null,
                        roles: rolesResult || null
                      }
                      res.status(200).json(userDetails)
                    } else {
                      // Invalid password
                      this.sendError(res, 403, "Invalid password")
                    }
                  }
                } catch (error) {
                  // Handle any error that occurred during the database query or other operations
                  console.error("Login error:", error)
                  this.sendError(res, 500, "Internal server error")
                }
                break
              
            default:
                this.sendError(res, 404, "Invalid endpoint")
        }
    }

    apiRequest(url, body, method, headers, callback, errcallback){
        fetch(url, {
            method: method || 'POST',
            headers: headers || {
                'content-type': 'text/json',
            },
            body
        })
        .then(res => res.json())
        .then(callback)
        .catch(errcallback);
    }

    sendError(res, code, msg){
        res.status(code)
        res.send({"error":msg})
    }
}

module.exports = API