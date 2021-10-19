var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "bok.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE bok (
            bokId INTEGER PRIMARY KEY,
            bokTitel TEXT,
            bokForfattare TEXT,
            bokIsbn TEXT,
            bokPris REAL
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO bok (bokTitel, bokForfattare, bokIsbn, bokPris) VALUES (?,?,?,?)'
            db.run(insert, ["Sagan om Ringen","J.R.R Tolkien","12345-6",120])
        }
    })  
    }
})


module.exports = db

