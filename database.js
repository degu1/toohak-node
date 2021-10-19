var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "toohak.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE quizes (
            quizId INTEGER PRIMARY KEY,
            quizName TEXT,
            quizQuestion TEXT,
            quizCorrectanswer TEXT,
            quizAnswer1 TEXT,
            quizAnswer2 TEXT,
            quizAnswer3 TEXT,
            quizAnswer4 TEXT
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO quizes (quizName, quizQuestion, quizCorrectanswer, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4) VALUES (?,?,?,?,?,?,?)'
            db.run(insert, ["Multiplications Quiz","Hur mycket är 10x10?","100","120", "99", "101", "0"])
            db.run(insert, ["Multiplications Quiz","Hur mycket är 1x10?","10","12", "9", "103", "0"])
            db.run(insert, ["Division Quiz","Hur mycket är 1x10?","10","12", "9", "103", "0"])
        }
    })  
    }
})


module.exports = db

