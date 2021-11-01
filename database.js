var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "toohak.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE users (
            user_id INTEGER PRIMARY KEY,
            user_email TEXT,
            user_ROLE TEXT,
            user_password TEXT,
            user_fullname TEXT
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO users 
                        (user_email, user_ROLE, user_password, user_fullname) 
                        VALUES 
                        ("dennis@email.com","student","password","Dennis"),
                        ("milad@email.com","student","password","Milad"),
                        ("jonas@email.com","student","password","Jonas")
                        `)
            }
        })
        db.run(`CREATE TABLE classes (
            classes_id INTEGER PRIMARY KEY,
            classes_name TEXT
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO classes 
                        (classes_name)
                        VALUES 
                        ("Klass 1"),
                        ("Klass 2")
                        `)
            }
        })
        db.run(`CREATE TABLE users_classes (
            users_classes_id INTEGER PRIMARY KEY,
            classes_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (classes_id) REFERENCES classes (classes_id),
            FOREIGN KEY (user_id) REFERENCES users (user_id)
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO users_classes 
                        (classes_id, user_id) 
                        VALUES 
                        ("1", "1"),
                        ("1", "2"),
                        ("1", "3"),
                        ("2", "3")
                        `)
            }
        })
        db.run(`CREATE TABLE quizes (
            quiz_id INTEGER PRIMARY KEY,
            quiz_name TEXT UNIQUE,
            quiz_passing INTEGER NOT NULL
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO quizes 
                        (quiz_name, quiz_passing) 
                        VALUES 
                        ("Multiplication Quiz", "1"),
                        ("Division Quiz", "1")
                        `)
                }
        })

        db.run(`   
            CREATE TABLE questions (
            question_id INTEGER PRIMARY KEY,
            question TEXT,
            correct_answer TEXT,
            quiz_id INTEGER NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizes (quiz_id)
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO questions 
                        (question, correct_answer, quiz_id)
                        VALUES 
                        ("Hur mycket är 10x10?","100",1),
                        ("Hur mycket är 1x10?","10",1),
                        ("Hur mycket är 10/2?","5",2)
                        `)
            }
        })

        db.run(`   
            CREATE TABLE answers (
            answer_id INTEGER PRIMARY KEY,
            answer TEXT,
            question_id INTEGER NOT NULL,
            FOREIGN KEY (question_id) REFERENCES questions (question_id)
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO answers 
                        (answer, question_id)
                        VALUES 
                        ("100",1),
                        ("99",1),
                        ("101",1),
                        ("10",1),
                        ("9",2),
                        ("8",2),
                        ("10",2),
                        ("11",2),
                        ("10",3),
                        ("4",3),
                        ("6",3),
                        ("5",3)
                        `)
            }
        })

        db.run(`CREATE TABLE classes_quizes (
            classes_quizes_id INTEGER PRIMARY KEY,
            quiz_id INTEGER NOT NULL,
            classes_id INTEGER NOT NULL,
            FOREIGN KEY (quiz_id) REFERENCES quizes (quiz_id),
            FOREIGN KEY (classes_id) REFERENCES classes (classes_id)
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO classes_quizes 
                        (quiz_id, classes_id)
                        VALUES 
                        ("1","1"),
                        ("2","1"),
                        ("1","2")
                        `)
            }
        })
        db.run(`CREATE TABLE result (
            result_id INTEGER PRIMARY KEY,
            result INTEGER,
            question_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            UNIQUE (question_id, user_id),
            FOREIGN KEY  (question_id) REFERENCES questions (question_id),
            FOREIGN KEY  (user_id) REFERENCES  users (user_id)
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO result 
                        (result, question_id, user_id)
                        VALUES 
                        ("0","1","1"),
                        ("0","1","2"),
                        ("1","1","3"),
                        ("0","2","1"),
                        ("1","2","2"),
                        ("1","2","3"),
                        ("1","3","1"),
                        ("1","3","2"),
                        ("1","3","3")
                        `)

            }
        })
    }
})


module.exports = db

