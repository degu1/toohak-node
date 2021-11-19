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
            user_role TEXT,
            user_password TEXT,
            user_username TEXT UNIQUE
            )`,(err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                db.run(`INSERT INTO users 
                        (user_role, user_password, user_username) 
                        VALUES 
                        ("student","password","Dennis"),
                        ("student","password","Milad"),
                        ("student","password","Jonas"),
                        ("teacher","password","Jerry")
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
            UNIQUE (classes_id, user_id),
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
                        ("Multiplication Quiz", "60"),
                        ("Division Quiz", "60")
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
                        ("Hur mycket är 4x5?","20",1),
                        ("Hur mycket är 7x8?","56",1),
                        ("Hur mycket är 9x9?","81",1),
                        ("Hur mycket är 3x7?","21",1),
                        ("Hur mycket är 8x2?","16",1),
                        ("Hur mycket är 6x2?","12",1),
                        ("Hur mycket är 8x9?","72",1),
                        ("Hur mycket är 1x6?","6",1),
                        ("Hur mycket är 10/2?","5",2),
                        ("Hur mycket är 56/7?","8",2),
                        ("Hur mycket är 8/4?","2",2),
                        ("Hur mycket är 21/7?","3",2),
                        ("Hur mycket är 81/9?","9",2),
                        ("Hur mycket är 40/5?","8",2),
                        ("Hur mycket är 60/6?","10",2),
                        ("Hur mycket är 36/3?","12",2),
                        ("Hur mycket är 72/9?","8",2),
                        ("Hur mycket är 9/3?","3",2)
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
                        ("100",1),("99",1),("101",1),("10",1),
                        ("9",2),("8",2),("10",2),("11",2),
                        ("10",3),("40",3),("20",3),("25",3),
                        ("11",4),("46",4),("56",4),("66",4),
                        ("71",5),("90",5),("82",5),("81",5),
                        ("22",6),("21",6),("20",6),("14",6),
                        ("16",7),("8",7),("2",7),("10",7),
                        ("16",8),("18",8),("14",8),("12",8),
                        ("71",9),("61",9),("72",9),("82",9),
                        ("1",10),("5",10),("6",10),("0",10),
                        ("4",11),("6",11),("1",11),("5",11),
                        ("7",12),("8",12),("9",12),("10",12),
                        ("3",13),("1",13),("2",13),("4",13),
                        ("1",14),("3",14),("2",14),("5",14),
                        ("9",15),("10",15),("8",15),("7",15),
                        ("6",16),("7",16),("8",16),("9",16),
                        ("9",17),("20",17),("11",17),("10",17),
                        ("11",18),("13",18),("10",18),("12",18),
                        ("8",19),("7",19),("6",19),("5",19),
                        ("3",20),("1",20),("2",20),("4",20)
                        `)
            }
        })

        db.run(`CREATE TABLE classes_quizes (
            classes_quizes_id INTEGER PRIMARY KEY,
            quiz_id INTEGER NOT NULL,
            classes_id INTEGER NOT NULL,
            UNIQUE (classes_id, quiz_id),
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
                        ("1","3","3"),
                        ("1","4","1"),
                        ("1","4","2"),
                        ("1","4","3"),
                        ("1","5","1"),
                        ("1","5","2"),
                        ("0","5","3"),
                        ("1","6","1"),
                        ("1","6","2"),
                        ("1","6","3"),
                        ("1","7","1"),
                        ("1","7","2"),
                        ("1","7","3"),
                        ("0","8","1"),
                        ("1","8","2"),
                        ("1","8","3"),
                        ("0","9","1"),
                        ("1","9","2"),
                        ("1","9","3"),
                        ("1","10","1"),
                        ("0","10","2"),
                        ("1","10","3"),
                        ("1","11","1"),
                        ("1","12","1"),
                        ("0","13","1"),
                        ("1","14","1"),
                        ("1","15","1"),
                        ("0","16","1"),
                        ("1","17","1"),
                        ("1","18","1"),
                        ("0","19","1"),
                        ("1","20","1")
                        `)

            }
        })
    }
})


module.exports = db

