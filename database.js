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
            quiz_id INTEGER PRIMARY KEY,
            quiz_name TEXT UNIQUE)`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insertQuizes = 'INSERT INTO quizes (quiz_name) VALUES (?)'
                db.run(insertQuizes, ["Multiplication Quiz"])
                db.run(insertQuizes, ["Division Quiz"])
                }
        })

        db.run(`   
            CREATE TABLE questions (
            question_id INTEGER PRIMARY KEY,
            question TEXT,
            correct_answer TEXT,
            answer1 TEXT,
            answer2 TEXT,
            answer3 TEXT,
            answer4 TEXT,
            quiz_id INTEGER NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizes (quiz_id)
            )`,(err) => {
            if (err) {
                console.log("in err question")
                // Table already created
            }else{
                console.log("in NOerr question")
                // Table just created, creating some rows
                var insertQuestions = 'INSERT INTO questions (question, correct_answer, answer1, answer2, answer3, answer4, quiz_id) VALUES (?,?,?,?,?,?,?)'
                db.run(insertQuestions, ["Hur mycket är 10x10?","100","120", "99", "101", "0",1])
                db.run(insertQuestions, ["Hur mycket är 1x10?","10","12", "9", "103", "0",1])
                db.run(insertQuestions, ["Hur mycket är 1x10?","10","12", "9", "103", "0",2])
            }
        })
    }
})


module.exports = db

