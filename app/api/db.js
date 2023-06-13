class DB {
    constructor(db){
        this.db=db
    }

    execQuery(q){
        return new Promise((resolve, reject) => {
            this.db.query(q, (e, result) => {
                if (e) {
                    return reject(e)
                };  
                resolve(result)
            });
        });
    }

    close(){
        this.db.end()
    }
}

module.exports = DB