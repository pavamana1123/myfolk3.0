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
              const { phone, username, password } = body;
          
              let user = null;
              let userDetails = null;
          
              // Check if the phone number exists in the participants table
              let query = `SELECT * FROM participants WHERE ${phone?"phone":"username"} = '${phone?phone:username}'`;
              let result = await this.db.execQuery(query);
          
              if (result.length > 0) {
                user = result[0];
                userDetails = {
                  username: user.username,
                  name: user.name,
                  phone: user.phone,
                  roleInfo: []
                };
              } else {
                // Phone number not found in the participants table, check in the users table
                query = `SELECT * FROM users WHERE ${phone?"phone":"username"} = '${phone?phone:username}'`;
                result = await this.db.execQuery(query);
          
                if (result.length > 0) {
                  user = result[0];
                  userDetails = {
                    username: user.username,
                    name: user.name,
                    phone: user.phone,
                    roleInfo: []
                  };
                }
              }
          
              if (user) {
                // User exists, check the password
                const storedPassword = user.pass; // Assuming the password is stored in a column named 'pass'
          
                // Compare the provided password with the stored password (assuming the password is already hashed)
                if (password === storedPassword) {
                  // Password is correct, search in the roles table
                  query = `SELECT * FROM roles WHERE username='${user.username}'`;
                  result = await this.db.execQuery(query);
          
                  if (result.length > 0) {
                    const roleInfo = result;
                    userDetails.roleInfo = roleInfo.map(r=>{
                      return {
                        roleName: r.roleName,
                        roleID: r.roleID,
                        roleIndex: r.roleIndex
                      }
                    })
                  }
          
                  res.status(200).json(userDetails);
                } else {
                  // Invalid password
                  this.sendError(res, 403, "Invalid password");
                }
              } else {
                // User does not exist
                this.sendError(res, 404, "User does not exist");
              }
            } catch (error) {
              // Handle any error that occurred during the database query or other operations
              console.error("Login error:", error);
              this.sendError(res, 500, "Internal server error");
            }
            break;
           
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