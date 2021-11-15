var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./database.js")


app.use(cors())
app.use(express.static('public'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var HTTP_PORT = 3000

async function dbAllPromise(query, params) {
    return new Promise(function (resolve, reject) {
        db.all(query, params, function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function dbRunPromise(query, params) {
    return new Promise(function (resolve, reject) {
        db.run(query, params, function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/quizes", (req, res, next) => {
    const sql = "select * from quizes"
    const params = []
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});

app.get("/quizes/:quiz_id", (req, res, next) => {
    const sql = `SELECT * FROM quizes WHERE quizes.quiz_id = ?`
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }

});

app.get("/quizes/users/:user_id", (req, res, next) => {
    const sql = `SELECT DISTINCT q.quiz_id, q.quiz_name FROM quizes q
        INNER JOIN classes_quizes cq ON q.quiz_id = cq.quiz_id
        INNER JOIN classes c ON c.classes_id = cq.classes_id
        INNER JOIN users_classes uc ON c.classes_id = uc.classes_id
        where uc.user_id = ?`
    const params = [req.params.user_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/questions/:quiz_id", (req, res, next) => {
    const sql = "select * from questions where quiz_id = ?"
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "questions": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/answers/:quiz_id", (req, res, next) => {
    const sql = `SELECT q.question_id, a.answer_id, a.answer
    from questions q 
    INNER JOIN answers a on a.question_id = q.question_id
    where q.quiz_id = ?;`
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }

});

app.get("/questions", (req, res, next) => {
    const sql = "select * from questions"
    const params = []
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "questions": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/answers", (req, res, next) => {
    const sql = "select * from answers"
    const params = []
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/quizes/:quizName", (req, res, next) => {
    const sql = "select * from quizes where quizName = ?"
    const params = [req.params.quizName]
    try {
        db.all(sql, params, (err, row) => {
            res.json({
                "message": "success",
                "quizes": row
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/quiznames/", (req, res, next) => {
    const sql = "select DISTINCT quiz_id, quiz_name from quizes"
    try {
        db.all(sql, (err, row) => {
            res.json({
                "message": "success",
                "quizes": row
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.post("/quiz_name/:quizName", async (req, res, next) => {
    const sql = 'INSERT INTO quizes (quiz_name, quiz_passing) VALUES (?,0)'
    const params = [req.params.quizName]
    const sql2 = `SELECT quiz_id FROM quizes WHERE quiz_name = ?`
    try {
        await dbRunPromise(sql, params)
        db.all(sql2, params, function (err, result) {
            res.json({
                "message": "success",
                "quiz_id": result[0].quiz_id
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
})

app.get("/results/", (req, res, next) => {
    const sql = "select * from result"
    try {
        db.all(sql, (err, row) => {
            res.json({
                "message": "success",
                "result": row
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.post("/result/", (req, res, next) => {
    const data = {
        result: req.body.result,
        question_id: req.body.question_id,
        user_id: req.body.user_id
    }

    const sql = 'INSERT INTO result (result, question_id, user_id) VALUES (?,?,?)'
    const params = [data.result, data.question_id, data.user_id]
    try {
        db.run(sql, params, function (err, result) {
            res.json({
                "message": "success",
                "result": data.result,
                "question_id": data.question_id,
                "user_id": data.user_id
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
})

app.post("/quiz_question/", async (req, res, next) => {
    const data = req.body
    let questionId

    const sql1 = 'INSERT INTO questions (question, correct_answer, quiz_id) VALUES (?,?,?)'
    var params1 = [data.question, data.correct_answer, data.quiz_id]

    const sql2 = 'SELECT question_id FROM questions q WHERE q.question = ?'
    const params2 = [data.question]

    const sql3 = 'INSERT INTO answers (answer, question_id) VALUES (?,?);'

    try {
        await dbAllPromise(sql1, params1)
        let result2 = await dbAllPromise(sql2, params2)
        questionId = result2[0].question_id
        for (let i = 0; i < data.answers.length; i++) {
            console.log("q_id " + questionId + "  " + data.answers[i].answer)
            var params3 = [data.answers[i].answer, questionId]
            db.run(sql3, params3, function (err, result) {
            })
        }
        res.json({
            "message": "success"
        })
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
})

app.delete("/questions/:questionId", async (req, res, next) => {
    const sql1 = 'DELETE FROM answers WHERE question_id = ?;'
    const sql2 = 'DELETE FROM questions WHERE question_id = ?;'
    const params = [req.params.questionId]
    try {
        await dbAllPromise(sql1, params)
        db.all(sql2, params, (err) => {
        });
        res.json({
            "message": "success"
        })
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.delete("/quizes/:quizId", (req, res, next) => {
    const sql = `DELETE FROM answers
                    WHERE question_id IN(
                    SELECT question_id FROM questions q
                    INNER JOIN quizes
                    ON q.quiz_id = quizes.quiz_id
                    WHERE quizes.quiz_id = ?);`
    const sql2 = 'DELETE FROM questions WHERE quiz_id = ?;'
    const sql3 = 'DELETE FROM quizes WHERE quiz_id = ?;'
    const params = [req.params.quizId]
    try {
        db.all(sql, params, (err, row) => {
        });
        db.all(sql2, params, (err) => {
        });
        db.all(sql3, params, (err) => {
        });
        res.json({"message": "success"})
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.put("/passing/:quiz_id/:passingNumber", (req, res, next) => {
    const sql = 'UPDATE quizes SET quiz_passing = ? WHERE quiz_id = ?;'
    const params = [req.params.passingNumber, req.params.quiz_id]
    try {
        db.run(sql, params, (err, rows) => {
            res.json({
                "message": "success"
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/passing/:quiz_id", (req, res, next) => {
    const sql = 'SELECT quiz_passing FROM quizes WHERE quiz_id = ?;'
    const params = [req.params.quiz_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.post("/login/", (req, res, next) => {
    const sql = 'SELECT * FROM users WHERE user_username = ? AND user_password = ?;'
    const params = [req.body.username, req.body.password]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "answers": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.post("/sign-up/", (req, res, next) => {
    const data = req.body
    const sql = 'INSERT INTO users (user_username, user_password, user_role) VALUES (?,?,?);'
    const params = [data.username, data.password, data.role]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success"
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/classes/", (req, res, next) => {
    const sql = "select * from classes"
    try {
        db.all(sql, (err, rows) => {
            res.json({
                "message": "success",
                "quizes": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});


app.post("/classes/:className", (req, res, next) => {
    const sql = 'INSERT INTO classes (classes_name) VALUES (?);'
    const params = [req.params.className]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success"
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});

app.get("/students/:classId", (req, res, next) => {
    const sql = `SELECT * FROM users u
                    INNER JOIN users_classes uc ON u.user_id = uc.user_id
                    where uc.classes_id = ?;`
    const params = req.params.classId
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "students": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});

app.patch("/classes/add_students/", async (req, res, next) => {
    const sql1 = 'DELETE FROM users_classes where classes_id = ?;'
    const sql2 = 'INSERT INTO users_classes (user_id, classes_id) VALUES (?,?);'
    const data = req.body
    try {
        await dbRunPromise(sql1, [data.classes_id])
        for (let i = 0; i < data.users.length; i++) {
            db.all(sql2, [data.users[i].user_id, data.classes_id])
        }
        res.json({
            "message": "success"
        })
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message});
    }
});



app.get("/user_statistics/users/:userId", (req, res, next) => {
    const sql = `SELECT quiz.quiz_name, SUM(result) AS result,COUNT(*) AS 'n_questions',
                     CASE WHEN SUM(result) < (COUNT(q.question_id))*quiz.quiz_passing/100 THEN 0 ELSE 1 END passed
                     FROM result r
                     INNER JOIN questions q on q.question_id = r.question_id
                     INNER JOIN quizes quiz ON quiz.quiz_id = q.quiz_id
                     WHERE r.user_id = ?
                     GROUP BY quiz.quiz_id;`
    const params = req.params.userId
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quiz_result": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});

app.get("/user_statistics/", (req, res, next) => {
    const sql = `SELECT q.question, q.correct_answer, r.result FROM result r
                    INNER JOIN questions q ON r.question_id = q.question_id
                    WHERE q.quiz_id = ? AND r.user_id = ?;`
    const params = [req.body.quiz_id, req.body.user_id]
    try {
        db.all(sql, params, (err, rows) => {
            res.json({
                "message": "success",
                "quiz_result": rows
            })
        });
    } catch (err) {
        console.error(err.message)
        res.status(400).json({"error": err.message})
    }
});